// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("session", token);
      window.location.replace(window.location.origin);
    }
  }, []);

  const [session, setSession] = useState<string | null>("");
  const [loading, setLoading] = useState(true)

  const getSession = async () => {
    const token = localStorage.getItem("session") as string;
    if (token) {
      const user = await getUserInfo(token);
      console.log(user.role)
      console.log(user)
      if (user) setSession(user);
    }
    setLoading(false)
  };

  useEffect(() => {
    getSession();
  }, []);

  const getUserInfo = async (session:string) => {
    try {
      const response = await fetch(
        "https://48sqgkcymc.execute-api.us-east-1.amazonaws.com/session",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session}`,
          },
        }
      );
      return response.json();
    } catch (error) {
      alert(error);
    }
  };

  const signOut = async () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      {session && session.role === "admin" ? (
         <div className="profile">
           <p>Welcome {session.name}!</p>
           <img
             src={session.picture}
             style={{ borderRadius: "50%" }}
             width={100}
             height={100}
             alt=""
           />
           <p>{session.email}</p>
           <Link href="/liman"><p>Go to liman</p></Link>
           <button onClick={signOut}>Sign out</button>
         </div>
      ) : (
        <main
          className={`flex min-h-screen flex-col items-center justify-between p-24`}
        >
          <h2>SST Auth Example</h2>
          <div>
            <a
              href={
                "https://48sqgkcymc.execute-api.us-east-1.amazonaws.com/auth/google/authorize"
              }
              rel="noreferrer"
            >
              <button>Sign in with Google</button>
            </a>
          </div>
        </main>
      )}
    </main>
  );
}
