import { disk } from "@/src/fs";
import { Readable } from "node:stream";


export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  const path = segments.join("/")


  try {
    const stream = await disk.getStream(path)

    return new Response(Readable.toWeb(stream)as unknown as globalThis.ReadableStream, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {

    if(err instanceof Error){
      console.log(err.message);
    }
    return new Response("Not found", { status: 404 });
  }
}