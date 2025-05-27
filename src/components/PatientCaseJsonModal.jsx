import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography
} from "@material-tailwind/react";

function removeIdFields(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeIdFields);
  } else if (obj && typeof obj === "object") {
    const newObj = {};
    for (const key in obj) {
      if (key !== "id") {
        newObj[key] = removeIdFields(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

export default function PatientCaseJsonModal({ open, handleClose, patientCase }) {
  const filtered = removeIdFields(patientCase);
  return (
    <Dialog size="lg" open={open} handler={handleClose}>
      <DialogHeader>
        <Typography variant="h6" color="blue-gray">
          JSON Data
        </Typography>
      </DialogHeader>
      <DialogBody className="max-h-[80vh] overflow-y-auto bg-gray-900">
        <pre className="text-xs text-green-200 whitespace-pre-wrap">
          {JSON.stringify(filtered, null, 2)}
        </pre>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="blue-gray" onClick={handleClose}>
          Đóng
        </Button>
      </DialogFooter>
    </Dialog>
  );
} 