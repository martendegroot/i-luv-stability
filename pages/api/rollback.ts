// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import request from "request";

const PRODUCTION_URL = "i-luv-stability.vercel.app";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const options = {
    method: "GET",
    url: "https://api.vercel.com/v6/deployments?app=i-luv-stability",
    headers: {
      Authorization: `Bearer ${process.env["VERCEL_TOKEN"]}`,
      "Content-Type": "application/json",
    },
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);

    const { deployments } = JSON.parse(response.body);

    const rollbackVersionId = deployments[1].uid;

    const options = {
      method: "POST",
      url: `https://api.vercel.com/v2/deployments/${rollbackVersionId}/aliases`,
      headers: {
        Authorization: `Bearer ${process.env["VERCEL_TOKEN"]}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alias: PRODUCTION_URL,
      }),
    };

    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.status(200).json({ rollbackTo: rollbackVersionId + "yay" });
    });
  });
}
