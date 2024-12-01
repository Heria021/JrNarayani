"use client"
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod"; 
import { zodResolver } from "@hookform/resolvers/zod"; 
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react"; // Change useMutation to useQuery

const searchSchema = z.object({
  searchTerm: z
    .string()
    .min(4, "Search term must be at least 4 characters long")
    .regex(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed"),
});

type SearchFormData = {
  searchTerm: string;
};

const SearchEstimate = () => {
  const [searchTerm, setSearchTerm] = useState<string>(""); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>(""); 
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 
  
  // Correct use of useQuery
  const data = useQuery(api.estimate.searchEstimates, {
    searchTerm: debouncedSearchTerm
  });

  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormData>({
    defaultValues: { searchTerm: "" },
    resolver: zodResolver(searchSchema), 
  });

  // Debounce search term update
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // Delay of 1000ms before sending the query

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Fetch search results when debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm.length >= 4) {
      setLoading(true);
    } else {
      setResults([]); // Clear results if search term is too short
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (data) {
      setResults(data);
      setLoading(false);
    } 
  }, [data]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value); 
  };

  const onSubmit = (data: SearchFormData) => {
    setSearchTerm(data.searchTerm);  // Update the search term when the form is submitted
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div>
          <Input
            id="searchTerm"
            placeholder="Search estimates..."
            {...register("searchTerm")}
            onChange={onInputChange}
          />
          {errors.searchTerm && <p className="text-red-500">{errors.searchTerm.message}</p>}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>  // Show loading state when fetching data
      ) : (
        <div>
          {results.length > 0 ? (
            <ul>
              {results.map((result: any, index: number) => (
                <li key={index}>
                  <p>{result.clientName} - {result.clientNumber}</p>
                  <p>{result.estimateNumber}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No results found</p>  // Show message if no results
          )}
        </div>
      )}
    </div>
  );
};

export default SearchEstimate;