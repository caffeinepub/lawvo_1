import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Order "mo:core/Order";

actor {
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

  module Case {
    public func compare(case1 : Case, case2 : Case) : Order.Order {
      Nat.compare(case1.id, case2.id);
    };
  };

  module Lawyer {
    public func compare(lawyer1 : Lawyer, lawyer2 : Lawyer) : Order.Order {
      Nat.compare(lawyer1.id, lawyer2.id);
    };
  };

  // Persistent storage
  var userLanguage : ?Language = null;
  let cases = Map.empty<Nat, Case>();
  let documents = Map.empty<Nat, UploadedDocument>();
  let guidanceHistory = Map.empty<Nat, GuidanceHistory>();

  // Lawyer profiles (seeded, persistent)
  let lawyerProfiles = [
    {
      id = 1;
      name = "Amit Patel";
      specialization = "Property Law";
      rating = 4.8;
      reviewsCount = 120;
      location = "Bangalore";
      bio = "Experienced property lawyer with 15 years in real estate law.";
      available = true;
    },
    {
      id = 2;
      name = "Rekha Sharma";
      specialization = "Criminal Law";
      rating = 4.9;
      reviewsCount = 200;
      location = "Mumbai";
      bio = "Specializes in criminal defense with a strong track record in court cases.";
      available = false;
    },
    {
      id = 3;
      name = "Suresh Kumar";
      specialization = "Family Law";
      rating = 4.7;
      reviewsCount = 80;
      location = "Chennai";
      bio = "Expert in family disputes, divorce, and child custody.";
      available = true;
    },
    {
      id = 4;
      name = "Priya Singh";
      specialization = "Corporate Law";
      rating = 4.6;
      reviewsCount = 70;
      location = "Delhi";
      bio = "Corporate lawyer with extensive experience in mergers and acquisitions.";
      available = true;
    },
    {
      id = 5;
      name = "Rajesh Rao";
      specialization = "Labour Law";
      rating = 4.5;
      reviewsCount = 60;
      location = "Hyderabad";
      bio = "Focuses on labour disputes and employment contracts.";
      available = false;
    },
    {
      id = 6;
      name = "Anita Das";
      specialization = "Consumer Rights";
      rating = 4.8;
      reviewsCount = 90;
      location = "Kolkata";
      bio = "Advocate for consumer protection and rights.";
      available = true;
    },
  ];

  // Methods
  public shared ({ caller }) func setUserLanguage(lang : Language) : async () {
    userLanguage := ?lang;
  };

  public query ({ caller }) func getUserLanguage() : async ?Language {
    userLanguage;
  };

  public shared ({ caller }) func addCase(newCase : Case) : async () {
    cases.add(newCase.id, newCase);
  };

  public query ({ caller }) func getCases() : async [Case] {
    cases.values().toArray().sort();
  };

  public shared ({ caller }) func addDocument(doc : UploadedDocument) : async () {
    documents.add(doc.id, doc);
  };

  public query ({ caller }) func getDocuments() : async [UploadedDocument] {
    documents.values().toArray();
  };

  public shared ({ caller }) func addGuidanceHistory(entry : GuidanceHistory) : async () {
    guidanceHistory.add(entry.id, entry);
  };

  public query ({ caller }) func getGuidanceHistory() : async [GuidanceHistory] {
    guidanceHistory.values().toArray();
  };

  public query ({ caller }) func getLawyerProfiles() : async [Lawyer] {
    lawyerProfiles.sort();
  };

  // Initialize seed data
  public shared ({ caller }) func initialize() : async () {
    let casesToAdd = [
      {
        id = 1;
        title = "Property Dispute - Bangalore";
        issueType = "Property Law";
        status = #Active;
        createdDate = Time.now();
        description = "Dispute over property ownership rights.";
      },
      {
        id = 2;
        title = "Divorce Case - Hyderabad";
        issueType = "Family Law";
        status = #Active;
        createdDate = Time.now();
        description = "Filing for divorce and child custody.";
      },
      {
        id = 3;
        title = "Consumer Complaint - Chennai";
        issueType = "Consumer Rights";
        status = #Active;
        createdDate = Time.now();
        description = "Complaint against defective product purchase.";
      },
    ];
    casesToAdd.forEach(
      func(c) {
        cases.add(c.id, c);
      }
    );
  };
};
