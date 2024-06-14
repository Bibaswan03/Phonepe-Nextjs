import axios from "axios";
const handler = async (req, res) => {
  
  const dataBase64 = req.body.dataBase64;
  const payload=dataBase64.toString();
  const checksum = req.body.checksum;
  console.log(dataBase64, checksum);

  try {
    const response = await axios.post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      payload,
      {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    );
    console.log(response);
    res.status(201).json({ success: true, response: response });
  } catch (error) {
    console.log(error);
  }
};
export default handler;
