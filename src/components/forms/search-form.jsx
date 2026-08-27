import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function SearchForm() {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = (values) => {
    // Placeholder behavior until page-specific logic is implemented.
    console.log("search-form", values);
  };

  return (
    <form
      className="flex w-full flex-col gap-2 sm:flex-row"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        {...register("query")}
        placeholder="Search by ID, name, or class"
      />
      <div className="flex gap-2">
        <Button type="submit">Search</Button>
        <Button type="button" variant="secondary" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}
