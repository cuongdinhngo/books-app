#!/usr/bin/env ts-node
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { generateUUID } from  '../utils/index.ts';

console.log("Seeding database...");
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// // AUTHORS
// const mockAuthors = [
//   { id: 1, full_name: "John Doe" },
//   { id: 2, full_name: "Jane Smith" },
//   { id: 3, full_name: "Alice Johnson" },
//   { id: 4, full_name: "Bob Brown" },
//   { id: 5, full_name: "Charlie Davis" },
//   { id: 6, full_name: "Diana Evans" },
//   { id: 7, full_name: "Ethan Foster" },
//   { id: 8, full_name: "Fiona Green" },
//   { id: 9, full_name: "George Harris" },
// ];
// const { error: authorError } = await supabase.from("authors").upsert(mockAuthors);
// if (authorError) {
//   console.error("Error inserting authors:", authorError);
// }

// // CATEGORIES
// const mockCategories = [
//   { id: 1, name: "Fiction" },
//   { id: 2, name: "Non-Fiction" },
//   { id: 3, name: "Science" },
//   { id: 4, name: "History" },
//   { id: 5, name: "Biography" },
//   { id: 6, name: "Fantasy" },
//   { id: 7, name: "Mystery" },
//   { id: 8, name: "Romance" },
//   { id: 9, name: "Thriller" },
//   { id: 10, name: "Self-Help" },
//   { id: 11, name: "Health" },
//   { id: 12, name: "Travel" }
// ];
// const { error: categoryError } = await supabase.from("categories").upsert(mockCategories);
// if (categoryError) {
//   console.error("Error inserting categories:", categoryError);
// }

// // PUBLISHERS
// const mockPublishers = [
//   { id: 1, name: "Penguin Random House" },
//   { id: 2, name: "HarperCollins" },
//   { id: 3, name: "Simon & Schuster" },
//   { id: 4, name: "Hachette Book Group" },
//   { id: 5, name: "Macmillan" },
//   { id: 6, name: "Scholastic" }
// ];
// const { error: publisherError } = await supabase.from("publishers").upsert(mockPublishers);
// if (publisherError) { 
//   console.error("Error inserting publishers:", publisherError);
// }

// // BOOKS
// const quantity = 50;
// const bookCovers = [
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/02369adf-166d-4aa7-9c84-e766ca3b61e8.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/106007e5-5365-4b6a-9878-adaaa923132b.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/18079fd9-5074-463c-a445-853e9dae4fc6.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/18b62dc2-0634-4ac8-8d5c-791d1b88e6b7.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/1daef48d-0310-4dd8-ab5f-29a22a297ee4.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/1e608bac-3c5d-4b8d-88c5-6c724affcec0.png',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/2ad39815-e09a-4d1a-ae35-b532e27a1f7c.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/31cee5f3-dd52-48b4-ad66-0e96c3eab250.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/33766a01-24aa-4693-aced-0da9aafde2ab.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/41e51127-ea8d-4a2b-bfb8-2354d8809ec9.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/d810e426-6053-4494-ae32-38e74831df8c.webp',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/ddd8952b-5050-4c77-9f23-9a69d9c93a2b.jpg',
//   'https://feizrojtanowvxiiashl.supabase.co/storage/v1/object/public/books/books/f06a2a73-f4f5-4a42-aa04-ea711d9302d9.webp'
// ];
// let bookIds = [] as number[];
// const mockBooks = Array.from({ length: quantity }, (_, index) => {
//   const bookId = index + 1;
//   bookIds.push(bookId);
//   return {
//     id: index + 1,
//     title: `Book Title ${index + 1}`,
//     description: `Description for Book Title ${index + 1}`,
//     cover_image: bookCovers[index % bookCovers.length]
//   }
// });
// const { error: bookError } = await supabase.from("books").upsert(mockBooks);
// if (bookError) {
//   console.error("Error inserting books:", bookError);
// }

// // BOOK ITEMS
// const mockBookItems = bookIds.flatMap((bookId) => {
//   return Array.from({ length: 4 }, (_, index) => ({
//     book_id: bookId,
//     status: 'pending'
//   }));
// });
// const { error: bookItemError } = await supabase.from("book_items").upsert(mockBookItems);
// if (bookItemError) {
//   console.error("Error inserting book items:", bookItemError);
// }

// // BOOK AUTHORS
// const mockBookAuthors = bookIds.map((bookId, index) => ({
//   book_id: bookId,
//   author_id: mockAuthors[index % mockAuthors.length].id
// }));
// const { error: bookAuthorError } = await supabase.from("books_authors").upsert(mockBookAuthors);
// if (bookAuthorError) {
//   console.error("Error inserting book authors:", bookAuthorError);
// }

// // BOOK CATEGORIES
// const mockBookCategories = bookIds.map((bookId, index) => ({
//   book_id: bookId,
//   category_id: mockCategories[index % mockCategories.length].id
// }));
// const { error: bookCategoryError } = await supabase.from("books_categories").upsert(mockBookCategories);
// if (bookCategoryError) {
//   console.error("Error inserting book categories:", bookCategoryError);
// }

// // BOOK PUBLISHERS
// const mockBookPublishers = bookIds.map((bookId, index) => ({
//   book_id: bookId,
//   publisher_id: mockPublishers[index % mockPublishers.length].id
// }));
// const { error: bookPublisherError } = await supabase.from("books_publishers").upsert(mockBookPublishers);
// if (bookPublisherError) {
//   console.error("Error inserting book publishers:", bookPublisherError);
// }

// // READERS
// const mockReaders = Array.from({ length: 10 }, (_, index) => {
//   return {
//     id: generateUUID(),
//     full_name: `Reader ${index + 1}`,
//     email: `reader${index + 1}@local.test`
//   }
// });
// const { error: readerError } = await supabase.from("readers").upsert(mockReaders);
// if (readerError) {
//   console.error("Error inserting readers:", readerError);
// }

// REVIEWS
const { data: readers } = await supabase.from("readers").select("id");
const readerIds = readers?.map((reader) => reader.id) || [];
const { data: books } = await supabase.from("books").select("id");
const bookIds = books?.map((book) => book.id) || [];
const mockBookReviews = bookIds.map((bookId, index) => {
  return Array.from({ length: 4 }, (_, index) => ({
    book_id: bookId,
    reader_id: readerIds[index % readerIds.length],
    rating: Math.floor(Math.random() * 5) + 1,
    content: `Review for Book Title ${index + 1}`,
    created_at: new Date().toISOString(),
  }));
});

// console.log(mockBookReviews.flat());

const { error: bookReviewError } = await supabase.from("reviews").upsert(mockBookReviews.flat());
if (bookReviewError) {
  console.error("Error inserting book reviews:", bookReviewError);
}

console.log("DONE");
