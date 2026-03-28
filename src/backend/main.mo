import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Order "mo:core/Order";
import Iter "mo:core/Iter";

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

  module UploadedDocument {
    public func compare(doc1 : UploadedDocument, doc2 : UploadedDocument) : Order.Order {
      Nat.compare(doc1.id, doc2.id);
    };
  };

  module GuidanceHistory {
    public func compare(history1 : GuidanceHistory, history2 : GuidanceHistory) : Order.Order {
      Nat.compare(history1.id, history2.id);
    };
  };

  module UserProfile {
    public func compare(user1 : UserProfile, user2 : UserProfile) : Order.Order {
      Text.compare(user1.name, user2.name);
    };
  };

  module LawyerProfile {
    public func compare(lawyer1 : LawyerProfile, lawyer2 : LawyerProfile) : Order.Order {
      Text.compare(lawyer1.name, lawyer2.name);
    };
  };

  // Persistent storage
  var userLanguage : ?Language = null;
  let cases = Map.empty<Nat, Case>();
  let documents = Map.empty<Nat, UploadedDocument>();
  let guidanceHistory = Map.empty<Nat, GuidanceHistory>();
  let users = Map.empty<Principal, UserProfile>();
  let lawyers = Map.empty<Principal, LawyerProfile>();
  let feedbacks = Map.empty<Principal, Feedback>();
  var loginHistory : [LoginRecord] = [];
  var nextCaseId = 1;

  // Persistent lawyer profiles
  var lawyerProfiles : [Lawyer] = [
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

  // COMMON METHODS

  public shared ({ caller }) func setUserLanguage(lang : Language) : async () {
    userLanguage := ?lang;
  };

  public query ({ caller }) func getUserLanguage() : async ?Language {
    userLanguage;
  };

  public shared ({ caller }) func initialize() : async () {
    let casesToAdd = [
      {
        id = 1;
        title = "Property Dispute - Bangalore";
        issueType = "Property Law";
        status = #Active;
        createdDate = Time.now();
        description = "Dispute over property ownership rights.";
        assignedLawyer = null;
        lastUpdated = Time.now();
      },
      {
        id = 2;
        title = "Divorce Case - Hyderabad";
        issueType = "Family Law";
        status = #Active;
        createdDate = Time.now();
        description = "Filing for divorce and child custody.";
        assignedLawyer = null;
        lastUpdated = Time.now();
      },
      {
        id = 3;
        title = "Consumer Complaint - Chennai";
        issueType = "Consumer Rights";
        status = #Active;
        createdDate = Time.now();
        description = "Complaint against defective product purchase.";
        assignedLawyer = null;
        lastUpdated = Time.now();
      },
    ];
    casesToAdd.forEach(
      func(c) {
        cases.add(c.id, c);
      }
    );
  };

  public shared ({ caller }) func addCase(newCase : Case) : async {
    id : Nat;
  } {
    let caseWithId = {
      newCase with
      id = nextCaseId;
      createdDate = Time.now();
      lastUpdated = Time.now();
      assignedLawyer = null;
    };
    cases.add(nextCaseId, caseWithId);
    nextCaseId += 1;
    { id = caseWithId.id };
  };

  public query ({ caller }) func getCases() : async [Case] {
    cases.values().toArray().sort();
  };

  public query ({ caller }) func getLawyerProfiles() : async [Lawyer] {
    lawyerProfiles.sort();
  };

  public shared ({ caller }) func addDocument(doc : UploadedDocument) : async {
    id : Nat;
  } {
    let docWithId = {
      doc with
      id = nextCaseId;
      uploadDate = Time.now();
    };
    documents.add(docWithId.id, docWithId);
    { id = docWithId.id };
  };

  public query ({ caller }) func getDocuments() : async [UploadedDocument] {
    documents.values().toArray().sort();
  };

  public shared ({ caller }) func addGuidanceHistory(entry : GuidanceHistory) : async {
    id : Nat;
  } {
    let entryWithId = {
      entry with
      id = nextCaseId;
      timestamp = Time.now();
    };
    guidanceHistory.add(entryWithId.id, entryWithId);
    { id = entryWithId.id };
  };

  public query ({ caller }) func getGuidanceHistory() : async [GuidanceHistory] {
    guidanceHistory.values().toArray().sort();
  };

  public shared ({ caller }) func registerOrUpdateUser(name : Text, phone : Text) : async Bool {
    if (name == "") { return false };
    if (phone.size() != 10 or not phone.chars().all(func(c) { c >= '0' and c <= '9' })) {
      return false;
    };

    let newProfile : UserProfile = {
      name;
      phone;
      principalId = caller;
    };
    users.add(caller, newProfile);

    // Record every login event separately
    let record : LoginRecord = {
      name;
      phone;
      role = "user";
      timestamp = Time.now();
      principalId = caller;
    };
    loginHistory := Array.tabulate<LoginRecord>(loginHistory.size() + 1, func(i) { if (i < loginHistory.size()) loginHistory[i] else record });

    true;
  };

  public shared ({ caller }) func registerLawyerLogin(name : Text, phone : Text) : async Bool {
    // Record lawyer login event
    let record : LoginRecord = {
      name;
      phone;
      role = "lawyer";
      timestamp = Time.now();
      principalId = caller;
    };
    loginHistory := Array.tabulate<LoginRecord>(loginHistory.size() + 1, func(i) { if (i < loginHistory.size()) loginHistory[i] else record });
    true;
  };

  public shared ({ caller }) func deleteUser(principalId : Principal) : async Bool {
    let existed = users.containsKey(principalId);
    users.remove(principalId);
    existed;
  };

  public query ({ caller }) func getMyProfile() : async ?UserProfile {
    users.get(caller);
  };

  public query ({ caller }) func listAllLawyers() : async [LawyerProfile] {
    lawyers.values().toArray().sort();
  };

  public query ({ caller }) func listAllUsersAdmin() : async [UserProfile] {
    users.values().toArray().sort();
  };

  public query ({ caller }) func getAllLoginRecords() : async [LoginRecord] {
    loginHistory;
  };

  // LAWYER SPECIFIC FUNCTIONS

  public shared ({ caller }) func registerLawyer(name : Text, phone : Text, barNumber : Text, specialization : Text, location : Text) : async Bool {
    if (name == "" or phone == "" or barNumber == "" or specialization == "" or location == "") {
      return false;
    };

    if (phone.size() != 10 or not phone.chars().all(func(c) { c >= '0' and c <= '9' })) {
      return false;
    };

    let newLawyer : LawyerProfile = {
      name;
      phone;
      barNumber;
      specialization;
      location;
      principalId = caller;
    };
    lawyers.add(caller, newLawyer);
    true;
  };

  public shared ({ caller }) func deleteLawyer(principalId : Principal) : async Bool {
    let existed = lawyers.containsKey(principalId);
    lawyers.remove(principalId);
    existed;
  };

  public query ({ caller }) func getLawyerProfile() : async ?LawyerProfile {
    lawyers.get(caller);
  };

  // CASE ASSIGNMENT

  public shared ({ caller }) func assignCaseToLawyer({ caseId : Nat; lawyerPrincipal : Principal }) : async Bool {
    switch (cases.get(caseId)) {
      case (null) { false };
      case (?existingCase) {
        let updatedCase = {
          existingCase with
          assignedLawyer = ?lawyerPrincipal;
          lastUpdated = Time.now();
        };
        cases.add(caseId, updatedCase);
        true;
      };
    };
  };

  public query ({ caller }) func getLawyerCases() : async [Case] {
    cases.values().toArray().filter(
      func(c) {
        switch (c.assignedLawyer) {
          case (null) { false };
          case (?lawyer) { lawyer == caller };
        };
      }
    );
  };

  public shared ({ caller }) func updateCaseStatus({ caseId : Nat; newStatus : CaseStatus }) : async Bool {
    switch (cases.get(caseId)) {
      case (null) { false };
      case (?existingCase) {
        switch (existingCase.assignedLawyer) {
          case (null) { false };
          case (?lawyer) {
            if (lawyer != caller) { return false };

            let updatedCase = {
              existingCase with
              status = newStatus;
              lastUpdated = Time.now();
            };
            cases.add(caseId, updatedCase);
            true;
          };
        };
      };
    };
  };

  // FEEDBACK

  public shared ({ caller }) func submitFeedback(rating : Nat, comment : Text) : async Bool {
    if (rating < 1 or rating > 5) { return false };

    let newFeedback : Feedback = {
      rating;
      comment;
      timestamp = Time.now();
      principalId = caller;
    };
    feedbacks.add(caller, newFeedback);
    true;
  };

  public query ({ caller }) func getUserFeedback() : async ?Feedback {
    feedbacks.get(caller);
  };

  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    feedbacks.values().toArray();
  };
};
