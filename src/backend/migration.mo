import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  type Language = {
    #English;
    #Hindi;
    #Kannada;
    #Tamil;
    #Telugu;
    #Bengali;
  };

  type CaseStatus = {
    #Active;
    #Resolved;
    #Pending;
  };

  type Case = {
    id : Nat;
    title : Text;
    issueType : Text;
    status : CaseStatus;
    createdDate : Time.Time;
    description : Text;
    assignedLawyer : ?Principal;
    lastUpdated : Time.Time;
  };

  type Lawyer = {
    id : Nat;
    name : Text;
    specialization : Text;
    rating : Float;
    reviewsCount : Nat;
    location : Text;
    bio : Text;
    available : Bool;
  };

  type LawyerProfile = {
    name : Text;
    phone : Text;
    barNumber : Text;
    specialization : Text;
    location : Text;
    principalId : Principal;
  };

  type UploadedDocument = {
    id : Nat;
    filename : Text;
    uploadDate : Time.Time;
    analysisSummary : Text;
  };

  type GuidanceHistory = {
    id : Nat;
    queryText : Text;
    resultSummary : Text;
    timestamp : Time.Time;
  };

  type UserProfile = {
    name : Text;
    phone : Text;
    principalId : Principal;
  };

  type Feedback = {
    rating : Nat;
    comment : Text;
    timestamp : Time.Time;
    principalId : Principal;
  };

  type LoginRecord = {
    name : Text;
    phone : Text;
    role : Text;
    timestamp : Time.Time;
    principalId : Principal;
  };

  type ChatbotEntry = {
    id : Nat;
    topicKey : Text;
    icon : Text;
    title : Text;
    keywords : [Text];
    intro : Text;
    whatToDo : Text;
    documents : [Text];
    lawyerType : Text;
    cost : Text;
    timeRequired : Text;
    successRate : Text;
    tip : Text;
  };

  type WaitlistEntry = {
    name : Text;
    email : Text;
    phone : Text;
    timestamp : Time.Time;
  };

  type OldActor = {
    userLanguage : ?Language;
    cases : Map.Map<Nat, Case>;
    documents : Map.Map<Nat, UploadedDocument>;
    guidanceHistory : Map.Map<Nat, GuidanceHistory>;
    users : Map.Map<Principal, UserProfile>;
    lawyers : Map.Map<Principal, LawyerProfile>;
    feedbacks : Map.Map<Principal, Feedback>;
    loginHistory : [LoginRecord];
    nextCaseId : Nat;
    chatbotEntries : [ChatbotEntry];
    lawyerProfiles : [Lawyer];
  };

  type NewActor = {
    userLanguage : ?Language;
    cases : Map.Map<Nat, Case>;
    documents : Map.Map<Nat, UploadedDocument>;
    guidanceHistory : Map.Map<Nat, GuidanceHistory>;
    users : Map.Map<Principal, UserProfile>;
    lawyers : Map.Map<Principal, LawyerProfile>;
    feedbacks : Map.Map<Principal, Feedback>;
    loginHistory : [LoginRecord];
    nextCaseId : Nat;
    chatbotEntries : [ChatbotEntry];
    lawyerProfiles : [Lawyer];
    waitlistEntries : Map.Map<Text, WaitlistEntry>;
  };

  public func run(old : OldActor) : NewActor {
    {
      old with
      waitlistEntries = Map.empty<Text, WaitlistEntry>();
    };
  };
};
