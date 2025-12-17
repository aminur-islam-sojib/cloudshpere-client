import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useState } from "react";
import CreateEvent from "./CreateEvent";

const CreateEventButton = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <div>
        <Button onClick={() => setIsContactOpen(true)} variant="default">
          Contact Form Modal
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
