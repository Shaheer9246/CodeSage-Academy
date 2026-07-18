// src/data/exams/sql.ts

// Importing the shared interfaces from our Python file
import { ExamTrack } from './python'; 

export const sqlTrack: ExamTrack = {
  id: 'sql',
  title: 'Database Admin (SQL)',
  description: 'Master relational databases, complex queries, joins, window functions, and normalization.',
  totalAvailable: 12,
  questions: [
    // --- EASY ---
    {
      topic: 'Basic Queries',
      difficulty: 'Easy',
      q: 'Which SQL statement is used to extract data from a database?',
      options: ['GET', 'OPEN', 'EXTRACT', 'SELECT'],
      answer: 3
    },
    {
      topic: 'Filtering',
      difficulty: 'Easy',
      q: 'Which clause is used to filter records in a SELECT statement?',
      options: ['WHERE', 'FILTER', 'ORDER BY', 'GROUP BY'],
      answer: 0
    },
    {
      topic: 'Data Modification',
      difficulty: 'Easy',
      q: 'Which SQL statement is used to update data in a database?',
      options: ['MODIFY', 'SAVE', 'UPDATE', 'ALTER'],
      answer: 2
    },
    {
      topic: 'Table Structure',
      difficulty: 'Easy',
      q: 'What is a Primary Key?',
      options: [
        'A key used to unlock encrypted databases',
        'A column or set of columns that uniquely identifies each row in a table',
        'The first column created in any table',
        'A constraint that allows null values'
      ],
      answer: 1
    },

    // --- INTERMEDIATE ---
    {
      topic: 'Joins',
      difficulty: 'Intermediate',
      q: 'Which type of JOIN returns all records when there is a match in either the left or right table?',
      options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'],
      answer: 3
    },
    {
      topic: 'Aggregation',
      difficulty: 'Intermediate',
      q: 'What is the difference between WHERE and HAVING?',
      options: [
        'WHERE is used for numerical data, HAVING for text',
        'WHERE filters rows before aggregation, HAVING filters grouped records after aggregation',
        'HAVING filters rows before aggregation, WHERE filters after',
        'There is no difference; they are interchangeable'
      ],
      answer: 1
    },
    {
      topic: 'Functions',
      difficulty: 'Intermediate',
      q: 'Which SQL function returns the number of rows in a table?',
      options: ['SUM()', 'COUNT()', 'TOTAL()', 'CALC()'],
      answer: 1
    },
    {
      topic: 'Subqueries',
      difficulty: 'Intermediate',
      q: 'What does the IN operator do when used with a subquery?',
      options: [
        'Creates an index on the subquery results',
        'Checks if a value matches any value in a list returned by the subquery',
        'Inserts data from the subquery into a table',
        'Sorts the results of the outer query based on the subquery'
      ],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'Window Functions',
      difficulty: 'Hard',
      q: 'What is the purpose of the ROW_NUMBER() window function?',
      options: [
        'To return the total count of rows in the table',
        'To assign a unique sequential integer to rows within a partition of a result set',
        'To calculate the rolling average of a numeric column',
        'To define the primary key of a temporary table'
      ],
      answer: 1
    },
    {
      topic: 'Performance & Indexing',
      difficulty: 'Hard',
      q: 'Which of the following best describes a Clustered Index?',
      options: [
        'It determines the physical order of data rows in a table',
        'It creates a separate structure from the data rows to improve search speed',
        'It allows duplicate keys by default',
        'It stores data in RAM for faster access'
      ],
      answer: 0
    },
    {
      topic: 'ACID Properties',
      difficulty: 'Hard',
      q: 'In the context of database transactions, what does the "I" in ACID stand for?',
      options: ['Integration', 'Integrity', 'Isolation', 'Iteration'],
      answer: 2
    },
    {
      topic: 'Common Table Expressions',
      difficulty: 'Hard',
      q: 'Which keyword is used to define a Common Table Expression (CTE) in SQL?',
      options: ['DECLARE', 'WITH', 'CREATE TEMP', 'LET'],
      answer: 1
    }
  ]
};
