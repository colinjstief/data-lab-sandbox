import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form } from "semantic-ui-react";

import map from "@/../public/map.png";
import { AsyncStatus, PDFExportFormSchema, PDFExportForm } from "@/lib/types";
import { asyncStatuses } from "@/lib/constants/asyncStatuses";
import { wait } from "@/lib/utils";

interface ReportFormProps {
  theMap: mapboxgl.Map | null;
}

const ReportForm = ({ theMap }: ReportFormProps) => {
  const [asyncStatus, setAsyncStatus] = useState<AsyncStatus>({
    status: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PDFExportForm>({
    resolver: zodResolver(PDFExportFormSchema),
    defaultValues: {
      title: "Custom report",
      notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
      logoImage: null,
    },
  });

  const formValues = watch();

  const exportMap = () => {
    if (!theMap) return;

    const mapCanvas = theMap.getCanvas();

    const cropCanvas = document.createElement("canvas");
    const cropContext = cropCanvas.getContext("2d");

    const newWidth = 512;
    const newHeight = 300;

    cropCanvas.width = newWidth;
    cropCanvas.height = newHeight;

    const startingX = (mapCanvas.width - newWidth) / 2;
    const startingY = (mapCanvas.height - newHeight) / 2;

    cropContext?.drawImage(
      mapCanvas,
      startingX,
      startingY,
      newWidth,
      newHeight,
      0,
      0,
      newWidth,
      newHeight
    );

    const mapImageUrl = cropCanvas.toDataURL("image/png");
    setValue("mapImage", mapImageUrl);
  };

  const asyncPresets =
    asyncStatuses[asyncStatus.status as keyof typeof asyncStatuses] ||
    asyncStatuses.default;

  const onSubmit = async (data: PDFExportForm) => {
    if (data.title && data.mapImage) {
      setAsyncStatus({
        status: "loading",
        message: "Reticulating splines...",
      });
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("mapImage", data.mapImage);
        if (data.notes) {
          formData.append("notes", data.notes);
        }
        if (data.logoImage) {
          formData.append("logoImage", data.logoImage[0]);
        }
        const res = await fetch("/api/report", {
          method: "POST",
          body: formData,
        });
        const pdfArray = await res.arrayBuffer();
        const imageBlob = new Blob([pdfArray], {
          type: "application/pdf",
        });
        window.open(URL.createObjectURL(imageBlob));
        if (res.ok) {
          setAsyncStatus({
            status: "",
            message: "",
          });
        } else {
          setAsyncStatus({
            status: "error",
            message: "Unable to generate PDF, please try again later",
          });
        }
      } catch (error) {
        setAsyncStatus({
          status: "error",
          message: "Unable to generate PDF, please try again later",
        });
        await wait(3000);
        setAsyncStatus({
          status: "",
          message: "",
        });
      }
    } else {
      console.log("Please fill out all fields.");
      setAsyncStatus({
        status: "error",
        message: "Please fill out all fields.",
      });
      await wait(3000);
      setAsyncStatus({
        status: "",
        message: "",
      });
    }
  };

  const logoImage = formValues.logoImage;
  let logoSrc = "";

  if (logoImage && logoImage?.length > 0) {
    logoSrc = URL.createObjectURL(logoImage[0]);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} className="p-2 flex flex-col gap-3">
      <Form.Group widths="equal" className="mb-2">
        <Form.Field error={!!errors.mapImage}>
          <label>1. Mark up and capture map</label>
          <div>
            {formValues.mapImage ? "Complete" : "Add shapes with map tools"}
          </div>
          <input
            type="string"
            className="hidden"
            disabled
            {...register("mapImage", { required: true })}
          />
          {errors.mapImage && <span>{errors.mapImage.message}</span>}
        </Form.Field>
        <Button
          type="button"
          onClick={exportMap}
          className="bg-slate-200 hover:bg-slate-300 rounded p-4"
          fluid
        >
          Capture Map View
        </Button>
      </Form.Group>
      <Form.Field error={!!errors.logoImage}>
        <label>2. Add Logo (Optional)</label>
        <input type="file" {...register("logoImage")} />
        {errors.logoImage && <span>{errors.logoImage.message}</span>}
      </Form.Field>
      <Form.Group widths="equal" className="mb-2">
        <Form.Field error={!!errors.title}>
          <label>3. Add title</label>
          <input type="text" {...register("title", { required: true })} />
          {errors.title && <span>{errors.title.message}</span>}
        </Form.Field>
        <Form.Field error={!!errors.notes}>
          <label>4. Add notes (Optional)</label>
          <input type="text" {...register("notes")} />
          {errors.notes && <span>{errors.notes.message}</span>}
        </Form.Field>
      </Form.Group>
      <div className="flex flex-col gap-5">
        <div className="p-5 mx-auto">
          <div className="flex flex-col gap-4 h-[240px] w-[185px] border border-1 shadow p-3">
            <div className="flex gap-4">
              <h2 className="font-bold text-xs w-[80%]">{formValues.title}</h2>
              {logoSrc && (
                <div className="w-[25px]">
                  <img src={logoSrc} alt="Logo" className="max-w-[100%]" />
                </div>
              )}
            </div>
            <div className="w-full h-[80px] overflow-clip">
              <img
                src={formValues.mapImage ? formValues.mapImage : map.src}
                alt="Map"
              />
            </div>
            <p className="text-xs">{formValues.notes}</p>
          </div>
        </div>
        <Button
          type={"submit"}
          className="bg-blue-200 hover:bg-blue-400 rounded p-4"
          disabled={asyncStatus.status === "loading"}
          loading={asyncStatus.status === "loading"}
          fluid
        >
          Export PDF
        </Button>
      </div>
    </Form>
  );
};

export default ReportForm;
