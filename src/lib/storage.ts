// LocalStorage yönetimi için yardımcı fonksiyonlar

export type UserType = "is_veren" | "hizmet_veren";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  userType: UserType;
  company?: string;
  phone?: string;
  city?: string;
  district?: string;
  services?: string[]; // Hizmet veren için
  description?: string; // Firma açıklaması
  rating?: number; // 0-50 arası (5 yıldız sistemi için x10)
  totalJobs?: number; // Tamamlanan iş sayısı
  isActive?: boolean; // Admin tarafından pasifleştirilebilir
  createdAt: string;
}

export interface Job {
  id: string;
  userId: string;
  category: string;
  title: string;
  company: string;
  // Lokasyon sistemi
  locationType: "il_ilce" | "liman" | "osb" | "serbest_bolge";
  city?: string; // İl/İlçe için
  district?: string; // İl/İlçe için
  port?: string; // Liman için
  portTerminal?: string; // Liman terminal/rıhtım/saha bilgisi
  osb?: string; // OSB için
  freeZone?: string; // Serbest Bölge için
  address: string;
  date: string;
  time: string;
  budget: string;
  description: string;
  phone: string;
  photos: string[]; // Fotoğraf URL'leri
  status: "open" | "service_selected" | "completed" | "cancelled";
  selectedOfferId?: string; // Kabul edilen teklif ID
  createdAt: string;
}

export interface Offer {
  id: string;
  jobId: string;
  userId: string;
  company: string;
  amount: string;
  duration: string;
  description: string;
  phone: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: string;
  completedAt?: string;
  rating?: number; // 1-5 yıldız
  review?: string; // İş veren yorumu
}

export interface Review {
  id: string;
  offerId: string;
  jobId: string;
  fromUserId: string; // İş veren
  toUserId: string; // Hizmet veren
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

// LocalStorage anahtarları
const STORAGE_KEYS = {
  USERS: "malsevk_users",
  JOBS: "malsevk_jobs",
  OFFERS: "malsevk_offers",
  REVIEWS: "malsevk_reviews",
  CURRENT_USER: "malsevk_current_user",
};

// Varsayılan admin kullanıcısını oluştur
export const initDefaultAdmin = () => {
  if (typeof window === "undefined") return;
  
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    const users = data ? JSON.parse(data) : [];
    const adminExists = users.some((u: User) => u.email === "admin");
    
    if (!adminExists) {
      const defaultAdmin: User = {
        id: "admin-" + Date.now(),
        email: "admin",
        password: "admin",
        name: "Admin",
        userType: "is_veren",
        company: "MALSEVK.COM",
        phone: "0850 123 45 67",
        city: "İstanbul",
        district: "Beşiktaş",
        createdAt: new Date().toISOString(),
      };
      users.push(defaultAdmin);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  } catch (error) {
    console.error("Admin init error:", error);
  }
};

// Kullanıcı işlemleri
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Get users error:", error);
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const addUser = (user: Omit<User, "id" | "createdAt">): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

export const getUserByEmail = (email: string): User | null => {
  const users = getUsers();
  return users.find((u) => u.email === email) || null;
};

export const getUserByPhone = (phone: string): User | null => {
  const users = getUsers();
  // Boşlukları temizleyerek karşılaştır
  const cleanPhone = phone.replace(/\s/g, "");
  return users.find((u) => u.phone?.replace(/\s/g, "") === cleanPhone) || null;
};

export const isEmailTaken = (email: string): boolean => {
  return getUserByEmail(email) !== null;
};

export const isPhoneTaken = (phone: string): boolean => {
  return getUserByPhone(phone) !== null;
};

export const getUserById = (id: string): User | null => {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
};

export const updateUser = (id: string, data: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  users[index] = { ...users[index], ...data };
  saveUsers(users);
  return users[index];
};

// Oturum işlemleri
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
};

export const setCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const logout = (): void => {
  setCurrentUser(null);
};

// İş ilanı işlemleri
export const getJobs = (): Job[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.JOBS);
  return data ? JSON.parse(data) : [];
};

export const saveJobs = (jobs: Job[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
};

export const addJob = (job: Omit<Job, "id" | "createdAt" | "status">): Job => {
  const jobs = getJobs();
  const newJob: Job = {
    ...job,
    id: Date.now().toString(),
    status: "open",
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  saveJobs(jobs);
  return newJob;
};

export const getJobById = (id: string): Job | null => {
  const jobs = getJobs();
  return jobs.find((j) => j.id === id) || null;
};

export const updateJob = (id: string, data: Partial<Job>): Job | null => {
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;
  jobs[index] = { ...jobs[index], ...data };
  saveJobs(jobs);
  return jobs[index];
};

export const getJobsByUserId = (userId: string): Job[] => {
  const jobs = getJobs();
  return jobs.filter((j) => j.userId === userId);
};

// Teklif işlemleri
export const getOffers = (): Offer[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
  return data ? JSON.parse(data) : [];
};

export const saveOffers = (offers: Offer[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
};

export const addOffer = (
  offer: Omit<Offer, "id" | "createdAt" | "status">
): Offer => {
  const offers = getOffers();
  const newOffer: Offer = {
    ...offer,
    id: Date.now().toString(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  offers.push(newOffer);
  saveOffers(offers);
  return newOffer;
};

export const getOffersByJobId = (jobId: string): Offer[] => {
  const offers = getOffers();
  return offers.filter((o) => o.jobId === jobId);
};

export const getOffersByUserId = (userId: string): Offer[] => {
  const offers = getOffers();
  return offers.filter((o) => o.userId === userId);
};

export const updateOffer = (
  id: string,
  data: Partial<Offer>
): Offer | null => {
  const offers = getOffers();
  const index = offers.findIndex((o) => o.id === id);
  if (index === -1) return null;
  offers[index] = { ...offers[index], ...data };
  saveOffers(offers);
  return offers[index];
};

export const acceptOffer = (offerId: string, jobId: string): boolean => {
  try {
    // Teklifi kabul et
    const offer = updateOffer(offerId, { status: "accepted" });
    if (!offer) return false;

    // Diğer teklifleri reddet
    const allOffers = getOffers();
    allOffers.forEach((o) => {
      if (o.jobId === jobId && o.id !== offerId && o.status === "pending") {
        updateOffer(o.id, { status: "rejected" });
      }
    });

    // İlanı güncelle
    updateJob(jobId, {
      status: "service_selected",
      selectedOfferId: offerId,
    });

    return true;
  } catch {
    return false;
  }
};

export const completeOffer = (
  offerId: string,
  rating: number,
  review: string
): boolean => {
  try {
    const offer = updateOffer(offerId, {
      status: "completed",
      completedAt: new Date().toISOString(),
      rating,
      review,
    });

    if (offer) {
      // İlanı tamamlandı olarak işaretle
      updateJob(offer.jobId, { status: "completed" });
      
      // Review ekle
      addReview({
        offerId: offer.id,
        jobId: offer.jobId,
        fromUserId: getJobById(offer.jobId)?.userId || "",
        toUserId: offer.userId,
        rating,
        comment: review,
      });

      // Hizmet verenin ortalama puanını güncelle
      updateUserRating(offer.userId);
    }

    return !!offer;
  } catch {
    return false;
  }
};

// Review işlemleri
export const getReviews = (): Review[] => {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveReviews = (reviews: Review[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
};

export const addReview = (
  review: Omit<Review, "id" | "createdAt">
): Review => {
  const reviews = getReviews();
  const newReview: Review = {
    ...review,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(newReview);
  saveReviews(reviews);
  return newReview;
};

export const getReviewsByUserId = (userId: string): Review[] => {
  const reviews = getReviews();
  return reviews.filter((r) => r.toUserId === userId);
};

// Kullanıcı ortalama puanını güncelle
const updateUserRating = (userId: string): void => {
  const reviews = getReviewsByUserId(userId);
  if (reviews.length === 0) return;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const roundedRating = Math.round(avgRating * 10); // 0-50 arası

  updateUser(userId, { rating: roundedRating, totalJobs: reviews.length });
};

export const getOffersByStatus = (
  userId: string,
  status: Offer["status"]
): Offer[] => {
  const offers = getOffers();
  return offers.filter((o) => o.userId === userId && o.status === status);
};

// Kategoriler
export const CATEGORIES = [
  "Lashingleme",
  "Konteyner Dolum",
  "Konteyner Boşaltım",
  "Liman Personeli",
  "Forklift Hizmeti",
  "Depolama",
];

// Türkiye illeri
export const CITIES = [
  "Adana",
  "Adıyaman",
  "Afyonkarahisar",
  "Ağrı",
  "Amasya",
  "Ankara",
  "Antalya",
  "Artvin",
  "Aydın",
  "Balıkesir",
  "Bilecik",
  "Bingöl",
  "Bitlis",
  "Bolu",
  "Burdur",
  "Bursa",
  "Çanakkale",
  "Çankırı",
  "Çorum",
  "Denizli",
  "Diyarbakır",
  "Edirne",
  "Elazığ",
  "Erzincan",
  "Erzurum",
  "Eskişehir",
  "Gaziantep",
  "Giresun",
  "Gümüşhane",
  "Hakkari",
  "Hatay",
  "Isparta",
  "Mersin",
  "İstanbul",
  "İzmir",
  "Kars",
  "Kastamonu",
  "Kayseri",
  "Kırklareli",
  "Kırşehir",
  "Kocaeli",
  "Konya",
  "Kütahya",
  "Malatya",
  "Manisa",
  "Kahramanmaraş",
  "Mardin",
  "Muğla",
  "Muş",
  "Nevşehir",
  "Niğde",
  "Ordu",
  "Rize",
  "Sakarya",
  "Samsun",
  "Siirt",
  "Sinop",
  "Sivas",
  "Tekirdağ",
  "Tokat",
  "Trabzon",
  "Tunceli",
  "Şanlıurfa",
  "Uşak",
  "Van",
  "Yozgat",
  "Zonguldak",
  "Aksaray",
  "Bayburt",
  "Karaman",
  "Kırıkkale",
  "Batman",
  "Şırnak",
  "Bartın",
  "Ardahan",
  "Iğdır",
  "Yalova",
  "Karabük",
  "Kilis",
  "Osmaniye",
  "Düzce",
];
