import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import CreateEvent from "./CreateEvent";

const CreateEventButton = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <div>
        <Button
          className=" bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => setIsContactOpen(true)}
          variant="default"
        >
          Create Event
        </Button>
      </div>
      <Modal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        size="xl"
      >
        <>
          <CreateEvent />
        </>
      </Modal>
    </>
  );
};

export default CreateEventButton;
