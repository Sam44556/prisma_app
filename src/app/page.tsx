"use client";
import { useState } from "react";
import Link from "next/link";

export default  function Home() {
  

  return (
    <main>
      <nav>
      <Link href="/reg">Register</Link> | 
      <Link href="/login">Login</Link> | 
      <Link href="/post">Posts</Link> |
      <Link href="/logout">logout</Link>
    </nav>

      </main>
      
  )
}