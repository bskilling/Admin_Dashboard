// import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { Loader } from "lucide-react";
import { AlertDialog, AlertDialogContent } from "../ui/alert-dialog";

export default function AlertLoader({ isloading }: { isloading: boolean }) {
  return (
    <AlertDialog open={isloading}>
      <AlertDialogContent className="bg-transparent border-none shadow-none">
        {/* <img src="/images/loader.gif" alt="" className="m-auto text-center" /> */}
        <Loader className="m-auto text-center animate-spin" size={40} />
        {/* <DotLottieReact
          src="https://lottie.host/f9d89e32-e145-4f5c-82be-2d63961bb00e/FQUkYJHWDi.lottie"
          loop
          autoplay
        /> */}
      </AlertDialogContent>
    </AlertDialog>
  );
}
