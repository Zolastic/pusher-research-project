import React, { useState } from 'react'
import { Button } from './ui/button'
import { Check } from 'lucide-react'
import { api } from "~/trpc/react";

type Props = {
  id: string;
  checked: boolean;
  part: string;
}

export default function done({ id, checked, part }: Props) {
  const [done, setDone] = useState<boolean>(checked);
  const updateDone = api.question.updateDone.useMutation();

  const updateDoneToDb = async () => {
    await updateDone
      .mutateAsync({
        id: id,
        done: !done,
        part: part
      })
      .then(() => {
        setDone(!done)
      })
      .catch((error) => {
        console.error("Error updating marked as done status", error);
      });
  }
  
  return (
    <div className="flex ml-auto mt-4">
        <Button 
          className="bg-[#300D4F] text-muted hover:bg-[#c9abab]"
          onClick={() => {updateDoneToDb()}}
        >
            <p>
            <Check size={16} className="inline" /> {done ? "Mark as Undone" : "Mark as Done"}
            </p>
        </Button>
    </div>
  )
}
