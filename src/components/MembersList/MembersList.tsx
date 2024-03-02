import MembersItem from "./MembersItem";
import { SpaceUser } from "@/services/models";

interface props {
  spaceUser: SpaceUser[];
}

const MembersList = ({ spaceUser }: props) => {
  if (!spaceUser || !Array.isArray(spaceUser)) {
    // Return null or an appropriate fallback component
    return null; // or <div>No members available</div>
  }

  return (
    <div className="flex w-full flex-col rounded bg-neutral-100 p-8 h-4/5 overflow-y-auto gap-5">
      <h3 className="mb-4 text-4xl font-bold">Members</h3>
      <MembersItem
        name="Leo"
        photoUrl="https://github.com/shadcn.png"
        status="2/4"
        description={{ summary: "hi" }}
      ></MembersItem>
            <MembersItem
        name="Leo"
        photoUrl="https://github.com/shadcn.png"
        status="Full"
        description={{ summary: "hi" }}
      ></MembersItem>
            <MembersItem
        name="Leo"
        photoUrl="https://github.com/shadcn.png"
        status="1/4"
        description={{ summary: "hi" }}
      ></MembersItem>
    </div>
  );
};

export default MembersList;
