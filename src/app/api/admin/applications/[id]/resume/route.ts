import { requireAdminSession } from "@/server/actions/require-session";
import { getCareerApplicationById } from "@/server/db/queries/applications";
import {
  loadLegacyResume,
  sanitizeResumeDownloadFilename,
} from "@/server/resume/legacy-resume";
import { getStorage } from "@/server/storage";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdminSession();
  } catch {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await context.params;
  if (!id || !UUID_RE.test(id)) {
    return new Response("Not found", { status: 404 });
  }

  const application = await getCareerApplicationById(id);
  if (!application) {
    return new Response("Not found", { status: 404 });
  }

  let file = application.resume_storage_key
    ? await getStorage().get(application.resume_storage_key)
    : null;

  if (!file && application.resume_url) {
    file = await loadLegacyResume(application.resume_url);
  }

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  const filename = sanitizeResumeDownloadFilename(application.resume_filename);
  const body = file.data.buffer.slice(
    file.data.byteOffset,
    file.data.byteOffset + file.data.byteLength,
  ) as ArrayBuffer;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": file.contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
