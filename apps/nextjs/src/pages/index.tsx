import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="px-8">
      <main className="flex-col place-content-center  justify-center">
        <div className="grid gap-4 sm:grid-cols-1 sm:place-items-center md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          This app is a scheduler. It lets employees request tiem off and lets
          them know what days the organization is closed. You also need an
          account to use this app
        </div>
      </main>
    </div>
  );
};

export default Home;
