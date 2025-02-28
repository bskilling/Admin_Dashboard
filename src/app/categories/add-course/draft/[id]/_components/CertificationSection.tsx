"use client";
import { format } from "date-fns";
import { Calendar, Clock } from "lucide-react";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TDraftCourseForm } from "../page";
import { Input } from "@/src/components/ui/input";
import { LuRadioTower } from "react-icons/lu";
import { BiSolidCertification } from "react-icons/bi";
import Image from "next/image";
import FileUploader from "@/src/components/global/FileUploader";

export default function CertificationSection({
  formState,
  register,
  setValue,
  watch,
}: {
  watch: UseFormReturn<TDraftCourseForm>["watch"];
  register: UseFormReturn<TDraftCourseForm>["register"];
  formState: UseFormReturn<TDraftCourseForm>["formState"];
  setValue: UseFormReturn<TDraftCourseForm>["setValue"];
}) {
  const [certification, setCertification] = React.useState<string | null>(null);
  const [partnerShip, setPartnership] = React.useState<string | null>(null);
  return (
    <section className="py-8 bg-card rounded-lg drop-shadow px-10 relative z-[40]  -mt-20 w-[80vw] flex gap-8 justify-between m-auto min-h-[300px]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-6 w-1/2">
        <div className="flex  gap-x-3">
          <Calendar className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="font-semibold">Application Starts</p>
            <p className="text-muted-foreground text-lg">
              {/* {format(new Date(startTime), "dd MMM, yyyy")} */}
              <Input type="date" {...register("startTime")} />
            </p>
          </div>
        </div>
        <div className="flex  gap-x-3">
          <Clock className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="font-semibold">Duration</p>
            <p className="text-muted-foreground text-lg">
              <Input type="number" {...register("durationHours")} /> Hours
            </p>
          </div>
        </div>
        <div className="flex  gap-x-3">
          <Calendar className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="font-semibold">Application Ends</p>
            <p className="text-muted-foreground text-lg">
              {/* {format(new Date(endTime), "dd MMM, yyyy")} */}
              <Input type="date" {...register("endTime")} />
            </p>{" "}
          </div>
        </div>

        <div className="flex  gap-x-3">
          <LuRadioTower className="w-6 h-6 text-indigo-500" />
          <div>
            <p className="font-semibold">Course Mode</p>
            <p className="text-muted-foreground text-lg">
              {"Online"} & {"Offline"}
            </p>
          </div>
        </div>
      </div>
      {/* <h2>Hey i am here</h2> */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-5 w-1/2">
        <div>
          <p className="font-semibold inline-flex items-center gap-x-3">
            {" "}
            <BiSolidCertification className="w-6 h-6 text-blue-500" />
            Certifications
          </p>
          <p className="font-semibold text-lg mt-3">
            <Input
              type="text"
              {...register("certification.title")}
              placeholder="Certification title"
            />
          </p>
          <p className="text-muted-foreground text-lg mt-3">
            <Input
              type="text"
              {...register("certification.content")}
              placeholder="Certification content"
            />
          </p>
          {/* <Image
            src={certification?.image?.viewUrl ?? placeholder}
            alt="Certification"
            className="w-full rounded-xl  max-h-40 bg-card object-cover"
            width={600}
            height={600}
          /> */}
          <div className="mt-5">
            <FileUploader
              setFileId={(fileId) =>
                setValue("certification.image", fileId as string)
              }
              title="cc"
              id={watch("certification.image") as string}
              key={watch("certification.image") as string}
              label="Certification"
              purpose="certification"
              setUrl={(url) => {
                if (url) {
                  setCertification(url);
                }
              }}
              url={certification ? certification : undefined}
            />
          </div>
        </div>
        <div>
          <p className="font-semibold inline-flex items-center gap-x-3">
            {" "}
            <BiSolidCertification className="w-6 h-6 text-blue-500" />
            PartnerShip
          </p>
          <p className="font-semibold text-lg mt-3">
            <Input
              type="text"
              {...register("partnerShip.title")}
              placeholder="Partnership title"
            />
          </p>
          <p className="text-muted-foreground text-lg mt-3">
            <Input
              type="text"
              {...register("partnerShip.content")}
              placeholder="Partnership content"
            />
          </p>
          {/* <Image
            src={certification?.image?.viewUrl ?? placeholder}
            alt="Certification"
            className="w-full rounded-xl  max-h-40 bg-card object-cover"
            width={600}
            height={600}
          /> */}
          <div className="mt-5">
            <FileUploader
              setFileId={(fileId) =>
                setValue("partnerShip.image", fileId as string)
              }
              title="cc"
              id={watch("partnerShip.image") as string}
              key={watch("partnerShip.image") as string}
              label="Partnership"
              purpose="partnership"
              setUrl={(url) => {
                if (url) {
                  setPartnership(url);
                }
              }}
              url={partnerShip ? partnerShip : undefined}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
