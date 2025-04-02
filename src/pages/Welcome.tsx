
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TypedText from "@/components/TypedText";
import { useAuth } from "@/contexts/AuthContext";

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showButton, setShowButton] = useState(false);
  
  useEffect(() => {
    // If user is already logged in, redirect to roadmap
    if (user) {
      navigate("/roadmap");
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-jalan-background p-6">
      <div className="max-w-md w-full space-y-10 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-jalan-text">
            <TypedText text="JALAN SUKSES" speed={70} onComplete={() => setShowButton(true)} />
          </h1>
          
          <p className="text-jalan-secondary text-lg mt-4">
            {showButton && <TypedText text="Mentor virtualmu untuk meraih mimpimu." speed={30} delay={500} />}
          </p>
        </div>
        
        {showButton && (
          <div className="animate-text-appear opacity-0" style={{ animationDelay: "1.5s" }}>
            <button
              onClick={() => navigate("/auth")}
              className="text-jalan-accent text-lg hover:brightness-110 transition-all duration-200 group"
            >
              &gt; Mulai Sekarang
              <span className="inline-block ml-1 transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
