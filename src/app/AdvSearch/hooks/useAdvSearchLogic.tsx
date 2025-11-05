import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/jobOfert/hooks/hook';
import { fetchOffers as fetchOffersThunk } from '@/app/jobOfert/lib/slice';

interface FilterStateLocal {
  range: string[];
  city: string;
  category: string[];
  tags: string[];
  priceRanges: string[];
  minPrice: number | null;
  maxPrice: number | null;
}

// Small helper to parse a price-range key into numeric min/max values.
// Small helper to parse a price-range key into numeric min/max values.
// Handles labels like "Menos de $90" (max=90), "Más de $400" (min=400),
// "$100 - $200" (min=100, max=200) and equality or single-number labels.
function parsePriceRange(key: string): { minPrice: number | null; maxPrice: number | null } {
  if (!key) return { minPrice: null, maxPrice: null };
  const normalized = key.replace(/[$€£,]/g, '').trim();
  const lowerLabel = normalized.toLowerCase();
  const matches = normalized.match(/-?\d+(?:\.\d+)?/g) || [];

  // Detect "Menos de" (less than) => max = number
  if (/(^|\s)menos(\s|$)|menos\s+de|^<\s*/i.test(lowerLabel)) {
    if (matches[0]) return { minPrice: null, maxPrice: Number(matches[0]) };
    return { minPrice: null, maxPrice: null };
  }

  // Detect "Más de" (greater than) => min = number
  if (/(^|\s)m(a|á)s(\s|$)|m(a|á)s\s+de|^>\s*/i.test(lowerLabel)) {
    if (matches[0]) return { minPrice: Number(matches[0]), maxPrice: null };
    return { minPrice: null, maxPrice: null };
  }

  // Range with two numbers
  if (matches.length >= 2) return { minPrice: Number(matches[0]), maxPrice: Number(matches[1]) };

  // Single number without qualifiers -> treat as min (>=)
  if (matches.length === 1) return { minPrice: Number(matches[0]), maxPrice: null };

  return { minPrice: null, maxPrice: null };
}

type UpdateParams = {
  newRanges?: string[];
  newCity?: string;
  newJobs?: string[];
  newCategories?: string[];
  newPriceRanges?: string[];
  newSearchQuery?: string;
  newPriceKey?: string;
  newTitleOnly?: boolean;
  newExactWords?: boolean;
};

export default function useAdvSearchLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [titleOnly, setTitleOnly] = useState(false);
  const [exactWords, setExactWords] = useState(false);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    fixer: false,
    ciudad: false,
    trabajo: false,
    categorias: false,
    precio: false,
  });
  const [selectedRanges, setSelectedRanges] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPriceKey, setSelectedPriceKey] = useState<string>('');

  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const [loading] = useState(false);
  // Date filter state: 'recent' | 'oldest' | 'specific'
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('specific');
  const [selectedSpecificDate, setSelectedSpecificDate] = useState<Date | null>(null);

  const dispatch = useAppDispatch();
  const totalRegistros = useAppSelector((s) => s.jobOffers.totalRegistros);
  const storeLoading = useAppSelector((s) => s.jobOffers.loading);
  const router = useRouter();
  const skipSyncRef = useRef<boolean | null>(null);
  const [clearSignal, setClearSignal] = useState<number>(0);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const updateSearchOnStateChange = ({
    newRanges = selectedRanges,
    newCity = selectedCity,
    newJobs = selectedJobs,
    newCategories = selectedCategories,
    newPriceRanges = selectedPriceRanges,
    newSearchQuery = searchQuery,
    newPriceKey = selectedPriceKey,
  }: UpdateParams = {}) => {
    if (
      !newSearchQuery &&
      newRanges.length === 0 &&
      newCity === '' &&
      newJobs.length === 0 &&
      newCategories.length === 0 &&
      newPriceRanges.length === 0
    ) {
      setResultsCount(0);
      return;
    }

    const { minPrice, maxPrice } = parsePriceRange(newPriceKey ?? '');

    const currentFilters: FilterStateLocal = {
      range: newRanges,
      city: newCity,
      category: newJobs,
      tags: newCategories,
      priceRanges: newPriceRanges,
      minPrice,
      maxPrice,
    };

    // local optimistic state update (keeps behavior identical)
    setResultsCount(null);

    // the actual fetch is handled by the shared thunk via effects
    return currentFilters;
  };


  const handleRangeChange = (range: string) => {
    setSelectedRanges((prev) => {
      const newRanges = prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range];
      updateSearchOnStateChange({ newRanges });
      return newRanges;
    });
  };

  const handleCityChange = (city: string) => {
    setSelectedCity((prev) => {
      const newCity = prev === city ? '' : city;
      updateSearchOnStateChange({ newCity });
      return newCity;
    });
  };

  const handleJobChange = (job: string) => {
    setSelectedJobs((prev) => {
      const newJobs = prev.includes(job) ? prev.filter((j) => j !== job) : [...prev, job];
      updateSearchOnStateChange({ newJobs });
      return newJobs;
    });
  };

  const handleDropdownChange = (filters: { categories: string[] }) => {
    const newTags = Array.isArray(filters.categories) ? filters.categories : [];
    setSelectedTags(newTags);
    updateSearchOnStateChange({ newCategories: newTags });
  };

  const handlePriceRangeChange = (filters: { priceRanges: string[]; priceKey?: string }) => {
    const newPriceRanges = Array.isArray(filters.priceRanges) ? filters.priceRanges : [];
    setSelectedPriceRanges(newPriceRanges);
    // If a single range was selected, the component may send a priceKey that can be parsed
    if (filters.priceKey && typeof filters.priceKey === 'string') {
      setSelectedPriceKey(filters.priceKey);
      updateSearchOnStateChange({ newPriceRanges, newPriceKey: filters.priceKey });
    } else {
      // Clear priceKey if multiple or none selected
      setSelectedPriceKey('');
      updateSearchOnStateChange({ newPriceRanges, newPriceKey: '' });
    }
  };

  const fetchGlobalTotal = () => {
    dispatch(
      fetchOffersThunk({
        searchText: '',
        filters: { range: [], city: '', category: [], tags: [], minPrice: null, maxPrice: null },
        sortBy: 'recent',
        page: 1,
        limit: 1,
      }),
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    skipSyncRef.current = true;
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query.trim());
    if (titleOnly) params.set('titleOnly', 'true');
    if (exactWords) params.set('exact', 'true');
    selectedRanges.forEach((r) => params.append('range', r));
    if (selectedCity) params.set('city', selectedCity);
    if (selectedJobs.length) params.set('category', selectedJobs.join(','));
    if (selectedTags.length) params.set('tags', selectedTags.join(','));
    const { minPrice, maxPrice } = parsePriceRange(selectedPriceKey);
    // Apply date/sort choices
    if (selectedDateFilter === 'recent') {
      params.set('sortBy', 'recent');
    } else if (selectedDateFilter === 'oldest') {
      params.set('sortBy', 'oldest');
    } else if (selectedDateFilter === 'specific' && selectedSpecificDate) {
      // format date as YYYY-MM-DD
      const y = selectedSpecificDate.getFullYear();
      const m = String(selectedSpecificDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedSpecificDate.getDate()).padStart(2, '0');
      params.set('date', `${y}-${m}-${d}`);
    }
    if (minPrice != null) params.set('minPrice', String(minPrice));
    if (maxPrice != null) params.set('maxPrice', String(maxPrice));
    params.set('page', '1');
    params.set('limit', '10');
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem('fromAdv', 'true');
      } catch {
        // ignore
      }
      // ensure the query also contains the flag (backup)
      params.set('fromAdv', 'true');
      window.location.href = `/jobOfert?${params.toString()}`;
    } else {
      params.set('fromAdv', 'true');
      router.push(`/jobOfert?${params.toString()}`);
    }
  };

  // initial fetch: global total
  useEffect(() => {
    dispatch(
      fetchOffersThunk({
        searchText: '',
        filters: { range: [], city: '', category: [], tags: [], minPrice: null, maxPrice: null },
        sortBy: 'recent',
        page: 1,
        limit: 1,
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounced fetch when filters change
  useEffect(() => {
    const { minPrice, maxPrice } = parsePriceRange(selectedPriceKey);
    const apiFilters = {
      range: selectedRanges,
      city: selectedCity,
      category: selectedJobs,
      tags: selectedTags,
      minPrice,
      maxPrice,
    };

    const t = window.setTimeout(() => {
      dispatch(
        fetchOffersThunk({
          searchText: searchQuery ?? '',
          filters: apiFilters,
          sortBy: 'recent',
          page: 1,
          limit: 1,
          titleOnly: titleOnly ?? false,
          exact: exactWords ?? false,
        }),
      );
    }, 150);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedRanges, selectedCity, selectedJobs, selectedTags, selectedPriceRanges, selectedPriceKey, titleOnly, exactWords]);

  return {
    // state
    searchQuery,
    titleOnly,
    exactWords,
    openSections,
    selectedRanges,
    selectedCity,
    selectedJobs,
    selectedCategories,
    selectedPriceRanges,
    selectedTags,
    selectedPriceKey,
    resultsCount,
    loading,
    totalRegistros,
    storeLoading,
    clearSignal,
    skipSyncRef,
    // setters / handlers
    setSearchQuery,
    setTitleOnly,
    setExactWords,
    toggleSection,
    handleRangeChange,
    handleCityChange,
    handleJobChange,
    handleDropdownChange,
    handlePriceRangeChange,
    handleSearch,
    setClearSignal,
    updateSearchOnStateChange,
    // expose specific setters used by page clear action
    setSelectedRanges,
    setSelectedCity,
    setSelectedJobs,
    setSelectedCategories,
    setSelectedPriceRanges,
    setSelectedPriceKey,
    setResultsCount,
    // date filter API
    selectedDateFilter,
    setSelectedDateFilter,
    selectedSpecificDate,
    setSelectedSpecificDate,
    fetchGlobalTotal,
  };
}
