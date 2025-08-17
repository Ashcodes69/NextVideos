import { getUploadAuthParams } from "@imagekit/next/server";

export async function GET() {
  //visit imagekit official website to see its documentation
  try {
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBIC_PUBLIC_KEY as string,
    });

    return Response.json({
      authenticationParameters,
      publicKey: process.env.NEXT_PUBIC_PUBLIC_KEY,
    });
  } catch (error) {
    console.error("Authentication for Imagekit failed: ", error);
    return Response.json(
      {
        success: false,
        error: "Authentication for Imagekit failed",
      },
      {
        status: 500,
      }
    );
  }
}
