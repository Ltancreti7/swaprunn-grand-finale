import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Camera, Plus, User, ClipboardList, CheckCircle, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import mapBackgroundImage from "@/assets/map-background.jpg";

const tabs = [
  { label: "Profile", icon: User, active: true },
  { label: "Pending", icon: ClipboardList },
  { label: "Assigned", icon: Settings },
  { label: "Done", icon: CheckCircle },
];

export default function DealerPortal() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-black text-white"
      style={{
        backgroundImage: `url(${mapBackgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="min-h-screen bg-black/80 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-10 pt-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <Logo className="h-8" />
            <Button
              className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20"
              variant="ghost"
              size="icon"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </div>

          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold">Dealer Portal</h1>
            <p className="text-sm text-white/70">
              Manage your deliveries and track driver assignments
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map(({ label, icon: Icon, active }) => (
              <Button
                key={label}
                variant={active ? "default" : "secondary"}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${
                  active ? "bg-[#E11900] hover:bg-[#B51400]" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            ))}
          </div>

          {/* Request Button */}
          <Button
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E11900] py-3 text-base font-semibold shadow-lg hover:bg-[#B51400]"
            onClick={() => navigate("/dealer/request")}
          >
            <Plus className="h-5 w-5" />
            Request Delivery
          </Button>

          {/* Profile Card */}
          <Card className="border-white/10 bg-white/5 text-white">
            <CardContent className="flex flex-col items-center gap-4 py-8">
              <div className="relative h-28 w-28">
                <img
                  src="/luke-tancreti.jpg"
                  alt="Luke Tancreti"
                  className="h-28 w-28 rounded-full object-cover"
                />
                <Button
                  variant="default"
                  size="icon"
                  className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-[#E11900] hover:bg-[#B51400]"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center gap-1 text-center">
                <div className="flex items-center gap-2 text-[#FACC15]">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-semibold">Top-rated dealer partner</span>
                </div>
                <h2 className="text-2xl font-bold">Luke Tancreti</h2>
                <p className="text-sm text-white/70">McGee Toyota of Claremont</p>
              </div>

              <Separator className="bg-white/10" />

              <div className="grid w-full gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm font-semibold">Open Requests</p>
                  <p className="text-xs text-white/60">Live metrics appear as jobs roll in.</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-sm font-semibold">On-time Delivery Rate</p>
                  <p className="text-xs text-white/60">Connect real data to unlock performance stats.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
