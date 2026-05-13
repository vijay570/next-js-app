import Link from "next/link";
export default async function Home({searchParams, params}) {
  console.log(await searchParams);
  console.log(await params);
  return (
    <>
      <h1>welcome</h1>
      <Link href="/about">About</Link>  <Link href="/services">Services</Link>

    
    </>
  );
}
