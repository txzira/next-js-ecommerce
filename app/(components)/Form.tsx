import React, { forwardRef, ComponentProps } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "lib/utils";

const formInputVariants = cva(
  "peer relative h-14 w-full rounded-lg border-2 border-[#cbdcf3] pl-2 pt-3 text-gray-900 placeholder-transparent shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none",
  {
    variants: {
      intent: { default: "bg-red-200", primary: "bg-white" },
      size: { default: "w-full", sm: "w-1/2", lg: "" },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  }
);

// @ts-ignore
interface FormInputProps
  extends ComponentProps<"input">,
    VariantProps<typeof formInputVariants> {
  label: string;
  id: string;
  size: "default" | "sm" | "lg";
}

const FormInput: React.FC<
  ComponentProps<"input"> & { text: string; number?: boolean }
> = ({ text, number, ...props }) => {
  return (
    <div className="relative mb-4">
      <input
        {...props}
        type={number ? "number" : "text"}
        className="peer relative h-14 w-full rounded-lg border-2 border-[#cbdcf3] pl-2 pt-3 text-gray-900 placeholder-transparent shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
      />

      <label
        htmlFor={props.id}
        className="absolute -top-0 left-0 pl-2 pt-3 text-xs text-gray-600 transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:text-xs peer-focus:text-gray-600"
      >
        {text}
      </label>
    </div>
  );
};
const FormInputCurrency: React.FC<
  ComponentProps<"input"> & { text: string }
> = ({ text, ...props }) => {
  return (
    <div className="relative mb-4">
      <input
        {...props}
        type="number"
        className="peer relative h-14 w-full rounded-lg border-2 border-[#cbdcf3] 
          pl-4
         pt-3 text-gray-900 placeholder-transparent shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
      />

      <div className="absolute left-2 top-[22px] peer-placeholder-shown:invisible peer-focus:visible">
        $
      </div>

      <label
        htmlFor={props.id}
        className="absolute -top-0 left-0 pl-2 pt-3 text-xs text-gray-600 transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:text-xs peer-focus:text-gray-600"
      >
        {text}
      </label>
    </div>
  );
};

const FormTextArea: React.FC<ComponentProps<"textarea"> & { text: string }> = ({
  text,
  ...props
}) => {
  return (
    <div className="relative mb-4">
      <textarea
        {...props}
        className="peer relative  w-full rounded-lg border-2 border-[#cbdcf3] pl-2 pt-6 text-gray-900 placeholder-transparent shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none"
      />
      <label
        htmlFor={props.id}
        className="absolute -top-0 left-0 pl-2 pt-3 text-xs text-gray-600 transition-all peer-placeholder-shown:top-1.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-0 peer-focus:text-xs peer-focus:text-gray-600"
      >
        {text}
      </label>
    </div>
  );
};

const formContainerVariants = cva(
  "peer relative h-14 w-full rounded-lg border-2 border-[#cbdcf3] pl-2 pt-3 text-gray-900 placeholder-transparent shadow-md focus:border focus:border-black focus:shadow-[0_0_0_4px_#cbdcf3] focus:outline-none",
  {
    variants: {
      intent: { default: "bg-red-200", primary: "bg-white" },
      size: { default: "w-full", sm: "w-1/2", lg: "" },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  }
);

const FormTitle: React.FC<ComponentProps<"h2">> = ({ ...props }) => {
  return (
    <h2 {...props} className={cn("my-3 text-2xl font-bold", props.className)}>
      {props.children}
    </h2>
  );
};

const FormHeading = ({ text }: { text: string }) => {
  return (
    <h3 className="mb-3 w-max border-b-[1px] text-[10px] font-semibold tracking-widest">
      {text}
    </h3>
  );
};

const FormContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto mb-5 h-max rounded-lg border border-[#cbdcf3] bg-white p-2">
      {children}
    </div>
  );
};

export {
  FormTitle,
  FormHeading,
  FormContainer,
  FormInput,
  FormInputCurrency,
  formInputVariants,
  FormTextArea,
};
