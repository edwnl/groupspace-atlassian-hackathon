import MembersList from "@/components/MembersList/MembersList";
import TutorialCard from "@/components/TutorialCard/TutorialCard";
import { getSpaceData } from "@/services/spacesServices";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { Link2Icon } from "@radix-ui/react-icons";

const AdminSpaceView = () => {
  const tutorialData: TutorialCardProps[] = [
    {
      name: "Tutorial 01",
      users: [
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
      ],
      size: 5,
      enrolled: 4,
      goal: "H1",
      timeCompat: 72,
      groupId:"1P1go8lxq9NI16C8SgLQEZAfMKO2"
    },
    {
      name: "Tutorial 04",
      users: [
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
      ],
      size: 5,
      enrolled: 4,
      goal: "H1",
      timeCompat: 72,
      groupId:"1P1go8lxq9NI16C8SgLQEZAfMKO2"
    },
    {
      name: "Tutorial 04",
      users: [
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
      ],
      size: 5,
      enrolled: 4,
      goal: "H1",
      timeCompat: 72,
      groupId:"1P1go8lxq9NI16C8SgLQEZAfMKO2"
    },
    {
      name: "Tutorial 04",
      users: [
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
      ],
      size: 5,
      enrolled: 4,
      goal: "H1",
      timeCompat: 72,
      groupId:"1P1go8lxq9NI16C8SgLQEZAfMKO2"
    },
    {
      name: "Tutorial 04",
      users: [
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
        "1P1go8lxq9NI16C8SgLQEZAfMKO2",
      ],
      size: 5,
      enrolled: 4,
      goal: "H1",
      timeCompat: 72,
      groupId:"1P1go8lxq9NI16C8SgLQEZAfMKO2"
    },
  ];

  const roomName = "Tutorial 01" // TEMP: Need to fetch space data with spaceId to get info

  // Gets the space ID
  let { spaceId } = useParams();

  // When page initially loads
  useEffect(() => {
    if (!spaceId) {
      spaceId = "";
    }

    getSpaceData(spaceId)
      .then((result) => {
        console.log(result);
        setSpaceData(result?.data as Space);
      })
      .catch((error: any) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="flex w-full flex-row h-screen px-8 py-3">
      <div className="w-2/3 pr-8">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{`Code: ${spaceId}`}</h3>
          <h1 className="text-6xl font-bold">{roomName}</h1>
          <div className="flex items-center gap-7 my-6">
            <h2 className="text-3xl font-bold ">Groups</h2>
            <Button className="font-bold bg-neutral-200 hover:bg-neutral-200 rounded">Edit Groups</Button>
          </div>
        </div>
        <div className="3xl:grid-cols-4 grid grid-flow-row grid-cols-2 gap-4 2xl:grid-cols-3 ">
          {tutorialData.map((tute) => (
            <TutorialCard {...tute} color={"bg-orange-100"}/>
          ))}
        </div>
      </div>
      <div className="w-1/3 flex flex-col justify-between gap-10 max-h-[950px] min-h-[700px]">
        <MembersList spaceId={spaceId}></MembersList>
        <div className="h-1/6 bg-neutral-100 mb-16 font-bold underline flex gap-5 items-center justify-center text-3xl"><Link2Icon className="scale-150"/>Share Link</div>
      </div>
    </div>
  );
};

export default AdminSpaceView;
