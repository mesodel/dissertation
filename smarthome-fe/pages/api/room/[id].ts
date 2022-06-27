import { getAccessToken, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { NextApiRequest, NextApiResponse } from "next";

const handleDelete = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const url = req.url?.substring("/api/".length);
    const response = await fetch(`${process.env.PRIVATE_API_URL}/iot/${url}`, {
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
    res.status(400).json({ statusCode: 400, message: "Bad request" });
  }
};

const handlePut = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { accessToken } = await getAccessToken(req, res);
    const url = req.url?.substring("/api/".length);
    const response = await fetch(`${process.env.PRIVATE_API_URL}/iot/${url}`, {
      method: req.method,
      body: JSON.stringify(req.body),
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
    res.status(400).json({ statusCode: 400, message: "Bad request" });
  }
};

export default withApiAuthRequired(
  async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === "DELETE") {
      handleDelete(req, res);
    } else if (req.method === "PUT") {
      handlePut(req, res);
    } else {
      res.status(404).json({ statusCode: 404, message: "Not found" });
    }
  }
);
