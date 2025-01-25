import { Button } from "@/components/ui/button";
import AppRoutes from "@/util/appRoutes";
import { Medal } from "lucide-react";
import Link from "next/link";

const MarketingPage = () => {
  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex items-center justify-center flex-col">
        <div className="mb-4 flex items-center border shadow-sm p-4 bg-amber-100 text-amber-700 rounded-full uppercase">
          <Medal className="h-6 w-6 mr-2" />
          No 1 task managment
        </div>
        <h1 className="text-3xl md:text-6xl text-center text-neutral-800 mb-6">
          PI Planning made easy!
        </h1>
        <div className="text-3xl md:text-6xl bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 p-2 rounded-md pb-4 w-fit">
          Plan better
        </div>
      </div>
      <div className="text-sm md:text-xl text-neutral-400 mt-4 text-center mx-auto">
        Collaborate and integrate
      </div>
      <Button className="mt-6" size="lg" asChild>
        <Link href={AppRoutes.SIGN_UP}>Start Planning!</Link>
      </Button>
    </div>
  );
};

export default MarketingPage;
