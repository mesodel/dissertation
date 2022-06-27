import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") {
      res.status(404).json({ statusCode: 404, message: "Not found" });

      return;
    }

    try {
      const { accessToken } = await getAccessToken(req, res);
      const url = req.url?.substring("/api/record/".length);
      const response = await fetch(`${process.env.PRIVATE_API_URL}/dw/${url}`, {
        method: req.method,
        // @ts-expect-error
        headers: {
          ...req.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status !== 200) {
        throw Error();
      }

      res.status(200).json(await response.json());
    } catch (err) {
      res.status(200).send("N/A");
    }
  }
);
