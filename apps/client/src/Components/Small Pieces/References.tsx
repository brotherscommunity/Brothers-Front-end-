"use client";

import { HTTPS, HTTP } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface ReferencesProps {
  fieldchange: (references: string[]) => void;
  initialValue: string[];
}

export default function References({
  fieldchange,
  initialValue = [],
}: ReferencesProps) {
  const { toast } = useToast();
  const [references, setAddReferences] = useState(initialValue);
  const [inputControlledValue, setInputControlledValue] = useState<string>("");

  function handleAddNewReference() {
    if (!inputControlledValue) {
      toast({ variant: "destructive", description: "No refrece added" });
      return;
    }
    try {
      const url = new URL(inputControlledValue);
    } catch (_) {
      toast({
        variant: "destructive",
        description: "Make sure the refrence is link ",
      });
      return;
    }

    if (references.includes(inputControlledValue)) {
      toast({
        variant: "destructive",
        description: "reference is already present",
      });

      return;
    }
    setInputControlledValue("");
    setAddReferences((addedReferences) => [
      ...addedReferences,
      inputControlledValue,
    ]);
    fieldchange([...references, inputControlledValue]);
  }

  function handleDeleteTag(reference: string) {
    // Remove the tag from the array of tags
    const newReferences = references.filter((element) => element !== reference);
    // Update the arrays
    setAddReferences(newReferences);
    // Update the form field
    fieldchange(newReferences);
  }

  return (
    <section className="mt-10">
      <h3 className="text-2xl text-black font-semibold"> References </h3>
      <div className="mt-4">
        {references.length > 0 &&
          references.map((reference, i) => {
            return (
              <div key={i} className="flex items-center gap-2 mt-3">
                <p> {i + 1} </p>
                <Link
                  href={reference}
                  className="hover:text-blue-500 text-base"
                >
                  {" "}
                  {reference}{" "}
                </Link>
                <X
                  onClick={() => handleDeleteTag(reference)}
                  className="text-orangeRed cursor-pointer ml-4"
                />
              </div>
            );
          })}
      </div>
      {references.length !== 3 && (
        <span className="flex flex-col items-start mt-10">
          <input
            value={inputControlledValue}
            onChange={(e) => setInputControlledValue(e.target.value)}
            type="text"
            placeholder="Add links for citation"
            className="max-sm:w-[280px] sm:w-[300px] md:w-[350px] lg:w-[380px] border border-gray-400 px-4 py-2.5 bg-button focus-visible:outline-none rounded-md"
          />
          <button
            type="button"
            onClick={handleAddNewReference}
            className="bg-navy rounded-md w-[150px] focus-visible:outline-none max-sm:text-sm sm:text-base text-white px-4 py-2 mt-8"
          >
            Add Citation
          </button>
        </span>
      )}
    </section>
  );
}
