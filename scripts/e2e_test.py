import re
import html as htmlmod
import subprocess
import sys
import time
import json

BASE = "http://localhost:3000"


def get(path, cookies=None):
    cmd = ["curl", "-s", "-D", "-", "-o", "/tmp/_body.html"]
    if cookies:
        cmd += ["-b", cookies]
    cmd += [BASE + path]
    subprocess.run(cmd, stdout=open("/tmp/_headers.txt", "w"))
    return open("/tmp/_body.html", encoding="utf-8").read()


def extract_hidden_from_form(content, form_marker=None):
    idx = content.find(form_marker) if form_marker else content.find("<form")
    form_start = content.rfind("<form", 0, idx) if form_marker else idx
    end = content.find("</form>", form_start)
    block = content[form_start:end]
    fields = {}
    for m in re.finditer(r'<input type="hidden" name="([^"]+)"(?: value="([^"]*)")?', block):
        name = htmlmod.unescape(m.group(1))
        val = htmlmod.unescape(m.group(2) or "")
        fields[name] = val
    return fields, form_start, end


def post_multipart(path, fields, files=None, cookies=None):
    cmd = ["curl", "-s", "-D", "/tmp/_post_headers.txt", "-o", "/tmp/_post_body.html", "-w", "%{http_code}"]
    if cookies:
        cmd += ["-b", cookies, "-c", cookies]
    for k, v in fields.items():
        cmd += ["-F", f"{k}={v}"]
    if files:
        for field_name, filepath, mimetype in files:
            cmd += ["-F", f"{field_name}=@{filepath};type={mimetype}"]
    cmd += ["-X", "POST", BASE + path]
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.stdout, open("/tmp/_post_body.html", encoding="utf-8").read()


def test_general_enquiry():
    print("=== General enquiry via /contact ===")
    content = get("/contact")
    hidden, _, _ = extract_hidden_from_form(content)
    hidden["renderedAt"] = str(int(time.time() * 1000) - 5000)
    hidden["enquiryType"] = "general"
    hidden["propertySlug"] = ""
    hidden["name"] = "Adaeze Test"
    hidden["phone"] = "+2348012345678"
    hidden["email"] = "adaeze.test@example.com"
    hidden["message"] = "I am interested in learning more about your Lekki listings, please reach out."
    status, body = post_multipart("/contact", hidden)
    print("status:", status)
    print("success banner present:", "Your enquiry has been received" in body or "enquiry has been received" in body)


def test_property_enquiry_and_inspection():
    print("=== Property enquiry + inspection via property page ===")
    content = get("/properties/the-marbury-duplex")
    # enquiry form (id="enquire")
    enquire_hidden, _, _ = extract_hidden_from_form(content, 'name="enquiryType" value="property"')
    enquire_hidden["renderedAt"] = str(int(time.time() * 1000) - 5000)
    enquire_hidden["name"] = "Segun Buyer"
    enquire_hidden["phone"] = "+2348022223333"
    enquire_hidden["email"] = "segun@example.com"
    enquire_hidden["message"] = "Is this property still available? I would like more photos."
    status, body = post_multipart("/properties/the-marbury-duplex", enquire_hidden)
    print("property enquiry status:", status)
    print("property enquiry success:", "has been received" in body)

    # inspection form (id="inspect")
    content2 = get("/properties/the-marbury-duplex")
    inspect_hidden, _, _ = extract_hidden_from_form(content2, 'name="enquiryType" value="inspection"')
    inspect_hidden["renderedAt"] = str(int(time.time() * 1000) - 5000)
    inspect_hidden["name"] = "Grace Inspector"
    inspect_hidden["phone"] = "+2348033334444"
    inspect_hidden["email"] = "grace@example.com"
    inspect_hidden["preferredInspectionDate"] = "2026-10-01"
    inspect_hidden["preferredInspectionTime"] = "14:00"
    inspect_hidden["message"] = ""
    status2, body2 = post_multipart("/properties/the-marbury-duplex", inspect_hidden)
    print("inspection request status:", status2)
    print("inspection request success:", "has been received" in body2)


def test_career_application():
    print("=== Career application with CV upload ===")
    content = get("/careers")
    m = re.search(r'href="(/careers/apply\?jobId=[^"]+)"', content)
    apply_path = htmlmod.unescape(m.group(1)) if m else "/careers/apply"
    print("apply path:", apply_path)

    content2 = get(apply_path)
    hidden, _, _ = extract_hidden_from_form(content2, 'name="name"')
    hidden["renderedAt"] = str(int(time.time() * 1000) - 5000)
    hidden["name"] = "Ngozi Applicant"
    hidden["email"] = "ngozi@example.com"
    hidden["phone"] = "+2348055556666"
    hidden["coverMessage"] = "I have three years of experience in property advisory and would love to join Brookfield's team."

    with open("/tmp/test_cv.pdf", "wb") as f:
        f.write(b"%PDF-1.4\n%fake test pdf content for upload testing\n%%EOF")

    status, body = post_multipart(
        apply_path, hidden, files=[("resume", "/tmp/test_cv.pdf", "application/pdf")]
    )
    print("application status:", status)
    print("application success:", "application has been received" in body)


if __name__ == "__main__":
    test_general_enquiry()
    test_property_enquiry_and_inspection()
    test_career_application()
