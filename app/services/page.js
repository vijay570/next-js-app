import Link from "next/link";
export default function services() {
  return (
    <>
      <h1>All Services</h1>
      
      <p>
        <Link href="/">App Development</Link>{" "}
      </p>
      
      <p>
        <Link href="/">Web Development</Link>{" "}
      </p>
      <p>
        <Link href="/">Mobile Development</Link>{" "}
      </p>
      <p>
        <Link href="/">SEO</Link>{" "}
      </p>
    </>
  );
}
