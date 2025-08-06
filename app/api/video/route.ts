import { authOptions } from "@/lib/auth";
import { connectToDb } from "@/lib/db";
import Video, { IVideo } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDb();
    const videos = await Video.find({}).sort({ createdAt: -1 }).lean();
    if (!videos || videos.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    return NextResponse.json(videos);
  } catch (error) {
    console.error("failed to fetch videos: ", error);
    return NextResponse.json(
      {
        success: false,
        error: "failed to fetch videos",
      },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
try {
    //we get session from next-auth
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        {
          success: false,
          error: "un-aurthorised user",
        },
        { status: 401 }
      );
    }
    await connectToDb();
    const body: IVideo = await req.json();
    if (
      !body.title ||
      !body.description ||
      !body.videoUrl ||
      !body.thumbnailUrl
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "missing required feilds to upload video",
        },
        { status: 400 }
      );
    }
    const videoData = {
      ...body,
      controls: body?.controls ?? true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: body.transformation?.quality ?? 100,
      },
    };
   const newVideo = await Video.create(videoData);
   return NextResponse.json(newVideo)
} catch (error) {
  console.error("failed to create video: ", error)
  return NextResponse.json(
        {
          success: false,
          error: "failed to create video",
        },
        { status: 500 }
      );
    }
}
}
