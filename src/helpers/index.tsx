import { toast } from "react-hot-toast";

export const toastListErrors = (errors: (string | undefined)[]) => {
  toast.error(
    <ul>
      {errors.map((error) => (
        <li key={error} className="ml-4 list-disc">
          {error}
        </li>
      ))}
    </ul>
  );
};
