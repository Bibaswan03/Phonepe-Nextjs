import { NextResponse } from 'next/server';
import sha256 from 'crypto-js/sha256';
import axios from 'axios';

export async function POST(req) {
  try {
    const data = await req.formData();
    console.log(data);

    const status = data.get('code');
    const merchantId = data.get('merchantId');
    const transactionId = data.get('transactionId');

    const st = `/pg/v1/status/${merchantId}/${transactionId}${process.env.NEXT_PUBLIC_SALT_KEY}`;
    const dataSha256 = sha256(st).toString();
    const checksum = `${dataSha256}###${process.env.NEXT_PUBLIC_SALT_INDEX}`;
    console.log(checksum);

    const options = {
      method: 'GET',
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    };

    const response = await axios.request(options);
    console.log('r===', response.data.code);

    if (response.data.code === 'PAYMENT_SUCCESS') {
      return NextResponse.redirect('http://localhost:3000/Success', { status: 301 });
    } else {
      return NextResponse.redirect('http://localhost:3000/Success', { status: 301 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.redirect('http://localhost:3000/Success', { status: 301 });
  }
}
