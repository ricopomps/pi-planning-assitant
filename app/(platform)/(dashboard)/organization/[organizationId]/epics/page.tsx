import { EpicsForm } from "./_components/epics-form";
import { EpicsList } from "./_components/epics-list";

const EpicsPage = async () => {
  return (
    <div className="flex justify-between w-full gap-2">
      <EpicsList />
      <EpicsForm />
    </div>
  );
};

export default EpicsPage;
