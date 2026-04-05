import Time "mo:core/Time";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Nat "mo:core/Nat";
import Char "mo:core/Char";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import Migration "migration";
import Int "mo:core/Int";

(with migration = Migration.run)
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
  let waitlistEntries = Map.empty<Text, WaitlistEntry>();
  var loginHistory : [LoginRecord] = [];
  var nextCaseId = 1;

  // Chatbot entries storage - initialized with defaults
  var chatbotEntries : [ChatbotEntry] = [];

  func getDefaultEntries() : [ChatbotEntry] {
    [
      {
        id = 1;
        topicKey = "land_dispute";
        icon = "🏞️";
        title = "Land Dispute / Ownership";
        keywords = ["land", "property", "ownership", "dispute", "plot", "deed", "title", "encumbrance"];
        intro = "This usually happens when two people claim the same land or ownership is unclear. This is very common in India.";
        whatToDo = "Start by checking your property documents and then file a case in the civil court for ownership declaration.";
        documents = ["Sale deed / Title deed", "Encumbrance certificate", "Property tax receipts", "Any agreement papers"];
        lawyerType = "Civil / Property Lawyer";
        cost = "₹20,000 – ₹2,00,000+ (depends on complexity & city)";
        timeRequired = "2–10 years (property cases are slow in India)";
        successRate = "Good if your documents are clear and registered";
        tip = "Always verify land records before buying to avoid future disputes.";
      },
      {
        id = 2;
        topicKey = "fir_police";
        icon = "👮";
        title = "Police Not Filing FIR";
        keywords = ["fir", "police", "complaint", "station", "report", "filing", "refuse", "refused"];
        intro = "If police refuse to file your FIR, it is your legal right to escalate. You are not stuck.";
        whatToDo = "Go to the Superintendent of Police (SP), or file a complaint before the Magistrate under Section 156(3) CrPC.";
        documents = ["Written complaint", "Proof (photos, messages, etc.)", "ID proof"];
        lawyerType = "Criminal Lawyer";
        cost = "₹5,000 – ₹50,000";
        timeRequired = "Few days to a few weeks";
        successRate = "Very high (law supports you strongly here)";
        tip = "You can also file an FIR online in many states via the state police portal.";
      },
      {
        id = 3;
        topicKey = "bail";
        icon = "⚖️";
        title = "Bail Process";
        keywords = ["bail", "custody", "arrest", "arrested", "jail", "release", "interim", "anticipatory"];
        intro = "Bail means temporary release from custody. It is not freedom from the case.";
        whatToDo = "Hire a criminal lawyer immediately and apply for bail in the nearest court.";
        documents = ["FIR copy", "ID proof", "Surety documents"];
        lawyerType = "Criminal Lawyer";
        cost = "₹10,000 – ₹1,00,000";
        timeRequired = "1 day to a few weeks";
        successRate = "High for minor offences; depends on crime severity";
        tip = "Cooperating with the investigation increases your chances of getting bail.";
      },
      {
        id = 4;
        topicKey = "divorce";
        icon = "👩‍⚖️";
        title = "Divorce Procedure";
        keywords = ["divorce", "separation", "marriage", "wife", "husband", "mutual", "contested", "family court", "alimony"];
        intro = "Divorce can be mutual (faster) or contested (longer). Mutual divorce saves time and reduces stress.";
        whatToDo = "File a divorce petition in the family court. Hiring a family lawyer is strongly recommended.";
        documents = ["Marriage certificate", "Address proof", "Evidence (if contested)", "Income details"];
        lawyerType = "Family Lawyer";
        cost = "₹20,000 – ₹2,00,000";
        timeRequired = "Mutual: 6 months–1 year | Contested: 2–5 years";
        successRate = "Very high if legally valid grounds exist";
        tip = "Mutual divorce is always smoother, cheaper, and less emotionally draining.";
      },
      {
        id = 5;
        topicKey = "domestic_violence";
        icon = "🛡️";
        title = "Domestic Violence";
        keywords = ["domestic", "violence", "abuse", "harassment", "husband", "wife", "beating", "threat", "dowry"];
        intro = "You are legally protected. Physical, emotional, and financial abuse are all punishable under Indian law.";
        whatToDo = "File a complaint under the Protection of Women from Domestic Violence Act or approach the nearest police women's cell.";
        documents = ["Medical reports (if any)", "Messages / evidence", "Witness details"];
        lawyerType = "Family / Criminal Lawyer";
        cost = "₹10,000 – ₹1,00,000";
        timeRequired = "Immediate protection orders are possible";
        successRate = "High if evidence exists";
        tip = "You can get protection orders, residence rights, and maintenance through the court.";
      },
      {
        id = 6;
        topicKey = "salary";
        icon = "💼";
        title = "Salary Not Paid";
        keywords = ["salary", "wages", "payment", "employer", "company", "job", "work", "labour", "fired", "terminated"];
        intro = "Employers cannot legally withhold your salary. You have strong rights under Indian labour law.";
        whatToDo = "File a complaint with the Labour Commissioner or approach the Labour Court.";
        documents = ["Offer letter", "Salary slips", "Bank statements"];
        lawyerType = "Labour Lawyer";
        cost = "₹5,000 – ₹50,000";
        timeRequired = "2–6 months";
        successRate = "Very high";
        tip = "Always keep all employment documents safely. Digital copies are equally valid.";
      },
      {
        id = 7;
        topicKey = "cheque_bounce";
        icon = "🏦";
        title = "Cheque Bounce";
        keywords = ["cheque", "check", "bounce", "dishonour", "bank", "payment", "neft", "rtgs", "loan"];
        intro = "A bounced cheque is a criminal offence under Section 138 of the Negotiable Instruments Act.";
        whatToDo = "Send a legal notice to the defaulter within 30 days of receiving the bank memo, then file a case.";
        documents = ["Bounced cheque", "Bank memo (return memo)", "Legal notice copy"];
        lawyerType = "Criminal / Civil Lawyer";
        cost = "₹10,000 – ₹1,00,000";
        timeRequired = "6 months – 2 years";
        successRate = "High if all documents are in order";
        tip = "Always keep proof of every financial transaction you make.";
      },
      {
        id = 8;
        topicKey = "consumer";
        icon = "🛍️";
        title = "Consumer / Defective Product";
        keywords = ["consumer", "product", "defective", "refund", "company", "service", "fraud", "cheated", "complaint", "amazon", "flipkart"];
        intro = "If you received a bad product or poor service, you can claim a full refund or compensation from the company.";
        whatToDo = "File a complaint in consumer court. You can also file online at edaakhil.nic.in.";
        documents = ["Bill / Invoice", "Warranty card", "Complaint proof (emails, photos)"];
        lawyerType = "Consumer Lawyer (optional for small claims)";
        cost = "₹1,000 – ₹20,000";
        timeRequired = "3–12 months";
        successRate = "High";
        tip = "For small claims (below ₹50 lakh), you do not need a lawyer in consumer court.";
      },
      {
        id = 9;
        topicKey = "cyber_fraud";
        icon = "🌐";
        title = "Online Fraud / Cyber Crime";
        keywords = ["cyber", "online", "fraud", "scam", "hack", "otp", "upi", "phishing", "money", "stolen", "internet"];
        intro = "If money was stolen online, act FAST. Time is critical for recovery.";
        whatToDo = "Immediately call the cyber helpline 1930, then report online at cybercrime.gov.in.";
        documents = ["Transaction details", "Screenshots of fraud", "Bank account information"];
        lawyerType = "Cyber Lawyer (optional)";
        cost = "Mostly free to file a complaint";
        timeRequired = "Immediate action needed";
        successRate = "Medium (depends heavily on how quickly you report)";
        tip = "Report within hours of the fraud for the best chance of recovering your money.";
      },
      {
        id = 10;
        topicKey = "builder_rera";
        icon = "🏠";
        title = "Builder Not Giving Possession";
        keywords = ["builder", "possession", "flat", "apartment", "rera", "construction", "delay", "project", "housing", "developer"];
        intro = "Builder delays are common in India, but the law strongly protects buyers under RERA.";
        whatToDo = "File a complaint in the RERA authority of your state or approach the consumer court.";
        documents = ["Sale agreement", "Payment receipts", "Builder communication (emails/letters)"];
        lawyerType = "Property Lawyer";
        cost = "₹10,000 – ₹1,00,000";
        timeRequired = "6 months – 3 years";
        successRate = "High in RERA (faster than civil court)";
        tip = "RERA is specifically designed for such disputes and is much faster than civil courts.";
      },
      {
        id = 11;
        topicKey = "fundamental_rights";
        icon = "⚖️";
        title = "Rights Violation by Authority";
        keywords = ["rights", "fundamental", "authority", "government", "violation", "police", "constitutional", "writ", "high court", "supreme court"];
        intro = "If your basic constitutional rights are violated by any authority, you can directly approach the High Court or Supreme Court.";
        whatToDo = "File a writ petition in the High Court (Article 226) or Supreme Court (Article 32) of India.";
        documents = ["Proof of rights violation", "Identity proof", "Supporting evidence"];
        lawyerType = "Constitutional Lawyer";
        cost = "₹20,000 – ₹2,00,000+";
        timeRequired = "A few weeks to several months";
        successRate = "Depends on strength of evidence and case";
        tip = "Courts take rights violations very seriously. Document everything carefully.";
      },
    ];
  };

  type WaitlistEntry = {
    name : Text;
    email : Text;
    phone : Text;
    timestamp : Time.Time;
  };

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
    loginHistory := Array.tabulate<LoginRecord>(loginHistory.size() + 1, func(i) { if (i < loginHistory.size()) { loginHistory[i] } else { record } });

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
    loginHistory := Array.tabulate<LoginRecord>(loginHistory.size() + 1, func(i) { if (i < loginHistory.size()) { loginHistory[i] } else { record } });
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

  // CHATBOT ENTRIES

  public query ({ caller }) func getChatbotEntries() : async [ChatbotEntry] {
    if (chatbotEntries.size() == 0) {
      getDefaultEntries();
    } else {
      chatbotEntries;
    };
  };

  public shared ({ caller }) func updateChatbotEntry(
    id : Nat,
    intro : Text,
    whatToDo : Text,
    documents : [Text],
    lawyerType : Text,
    cost : Text,
    timeRequired : Text,
    successRate : Text,
    tip : Text
  ) : async Bool {
    if (chatbotEntries.size() == 0) {
      chatbotEntries := getDefaultEntries();
    };
    var found = false;
    chatbotEntries := Array.tabulate<ChatbotEntry>(chatbotEntries.size(), func(i) {
      let entry = chatbotEntries[i];
      if (entry.id == id) {
        found := true;
        { entry with intro; whatToDo; documents; lawyerType; cost; timeRequired; successRate; tip };
      } else {
        entry;
      };
    });
    found;
  };

  public shared ({ caller }) func resetChatbotEntries() : async Bool {
    chatbotEntries := getDefaultEntries();
    true;
  };

  // WAITLIST FUNCTIONALITY

  public shared ({ caller }) func addWaitlistEntry(name : Text, email : Text, phone : Text) : async Bool {
    if (name == "" or email == "" or phone == "") { return false };
    if (phone.size() != 10 or not phone.chars().all(func(c) { c >= '0' and c <= '9' })) {
      return false;
    };

    let now = Time.now();
    let id = email # "-" # toNat(now).toText();

    // Update persistent map first
    let newWaitlistEntry : WaitlistEntry = {
      name;
      email;
      phone;
      timestamp = now;
    };
    waitlistEntries.add(id, newWaitlistEntry);
    true;
  };

  public query ({ caller }) func getAllWaitlistEntries() : async [WaitlistEntry] {
    waitlistEntries.values().toArray();
  };

  public query ({ caller }) func getMyWaitlistEntry(email : Text) : async ?WaitlistEntry {
    waitlistEntries.get(email);
  };

  func toNat(time : Time.Time) : Nat {
    time.toNat();
  };
};
