// src/data/exams/sql.ts

import { ExamTrack } from './python';

export const sqlTrack: ExamTrack = {
  id: 'sql',
  title: 'Relational Databases: SQL & PostgreSQL',
  description: 'Master relational databases, complex joins, window functions, MVCC, triggers, JSONB, and advanced PostgreSQL performance tuning.',
  totalAvailable: 24,
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
    {
      topic: 'Sorting & Offsets',
      difficulty: 'Easy',
      q: 'How do you retrieve the top 5 highest salary records in PostgreSQL?',
      options: [
        'SELECT TOP 5 * FROM employees ORDER BY salary DESC',
        'SELECT * FROM employees ORDER BY salary DESC LIMIT 5',
        'SELECT * FROM employees FETCH FIRST 5 ROWS ONLY',
        'Both B and C are valid in PostgreSQL'
      ],
      answer: 3
    },
    {
      topic: 'Data Types',
      difficulty: 'Easy',
      q: 'Which native data type in PostgreSQL is used for auto-incrementing integer values?',
      options: ['AUTO_INCREMENT', 'SERIAL', 'IDENTITY_INSERT', 'SEQUENCE_INT'],
      answer: 1
    },
    {
      topic: 'Constraints',
      difficulty: 'Easy',
      q: 'Which constraint ensures that all values in a column satisfy a specific Boolean condition?',
      options: ['UNIQUE', 'FOREIGN KEY', 'CHECK', 'DEFAULT'],
      answer: 2
    },
    {
      topic: 'Views',
      difficulty: 'Easy',
      q: 'What is a SQL View?',
      options: [
        'A physical copy of data stored in memory',
        'A virtual table based on the result-set of an SQL statement',
        'An index designed for full-text search',
        'A database backup file'
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
    {
      topic: 'JSON in PostgreSQL',
      difficulty: 'Intermediate',
      q: 'What is the key functional difference between `json` and `jsonb` data types in PostgreSQL?',
      options: [
        '`json` stores data as binary, while `jsonb` stores text',
        '`jsonb` parses JSON inputs into binary format, allowing indexing and faster queries at the cost of slightly slower insertion',
        '`json` supports indexing with GIN, while `jsonb` does not',
        '`jsonb` only supports top-level object queries'
      ],
      answer: 1
    },
    {
      topic: 'PostgreSQL Operators',
      difficulty: 'Intermediate',
      q: 'In PostgreSQL JSONB querying, what does the `->>` operator do?',
      options: [
        'Extracts a JSON object by key as `jsonb`',
        'Extracts a JSON object field or array element as `text`',
        'Checks if a JSON element contains a key',
        'Deletes a key from a JSON object'
      ],
      answer: 1
    },
    {
      topic: 'Common Table Expressions',
      difficulty: 'Intermediate',
      q: 'Which statement regarding Common Table Expressions (CTEs) in PostgreSQL is TRUE?',
      options: [
        'CTEs are defined using the `WITH` clause and improve query readability and modularity',
        'CTEs permanently create physical tables on disk',
        'CTEs cannot be chained together in a single query',
        'CTEs are only used for full-table export operations'
      ],
      answer: 0
    },
    {
      topic: 'Database Triggers',
      difficulty: 'Intermediate',
      q: 'When writing a PL/pgSQL trigger function, which special variable stores the new database row for INSERT/UPDATE operations?',
      options: ['CURRENT_ROW', 'NEW', 'TARGET', 'INSERTED'],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'Window Functions',
      difficulty: 'Hard',
      q: 'What is the main difference between `RANK()` and `DENSE_RANK()` window functions when handling ties?',
      options: [
        '`RANK()` assigns duplicate values the same rank and skips subsequent ranks; `DENSE_RANK()` does not skip ranks',
        '`DENSE_RANK()` skips subsequent ranks; `RANK()` leaves no gaps',
        '`RANK()` only works on string data; `DENSE_RANK()` works on numbers',
        'There is no difference; they produce identical results in all scenarios'
      ],
      answer: 0
    },
    {
      topic: 'Performance & Indexing',
      difficulty: 'Hard',
      q: 'Which index type in PostgreSQL is specifically optimized for indexing JSONB, array types, and full-text search vectors?',
      options: ['B-Tree', 'BRIN', 'GIN (Generalized Inverted Index)', 'Hash'],
      answer: 2
    },
    {
      topic: 'ACID Properties',
      difficulty: 'Hard',
      q: 'In the context of database transactions, what does the "I" in ACID stand for?',
      options: ['Integration', 'Integrity', 'Isolation', 'Iteration'],
      answer: 2
    },
    {
      topic: 'MVCC & Vacuum',
      difficulty: 'Hard',
      q: 'Why does PostgreSQL require the `VACUUM` maintenance process?',
      options: [
        'To re-index B-Tree structures automatically',
        'To remove obsolete row versions (dead tuples) left behind by UPDATE and DELETE statements in MVCC',
        'To clear stale connections from the connection pool',
        'To flush the Write-Ahead Log (WAL) to disk'
      ],
      answer: 1
    },
    {
      topic: 'Transaction Isolation Levels',
      difficulty: 'Hard',
      q: 'Which concurrency side-effect is prevented by the `SERIALIZABLE` isolation level that is STILL possible under `REPEATABLE READ` in standard PostgreSQL?',
      options: ['Dirty Read', 'Non-repeatable Read', 'Phantom Read', 'Serialization Anomaly'],
      answer: 3
    },
    {
      topic: 'Advanced Indexing',
      difficulty: 'Hard',
      q: 'When should you choose a BRIN (Block Range Index) over a standard B-Tree index in PostgreSQL?',
      options: [
        'When the table is very large and data is physically ordered on disk along the indexed column (e.g., timestamps)',
        'When querying random string patterns with wildcard searches',
        'When indexing unique key constraints',
        'When working strictly with vector embeddings and AI similarity searches'
      ],
      answer: 0
    },
    {
      topic: 'Table Partitioning',
      difficulty: 'Hard',
      q: 'In PostgreSQL declarative table partitioning, what happens during "Partition Pruning"?',
      options: [
        'Old partitions are automatically dropped after an expiration period',
        'The query planner skips scanning partitions that cannot contain data matching the WHERE clause',
        'Indices on child partitions are removed to save disk space',
        'Partitioned tables are compacted using auto-vacuum'
      ],
      answer: 1
    },
    {
      topic: 'Multi-Tenant Security',
      difficulty: 'Hard',
      q: 'In PostgreSQL, which feature allows you to restrict which rows a user can SELECT, UPDATE, or DELETE based on their security context (e.g., `tenant_id`)?',
      options: [
        'Role-Based Access Control (RBAC)',
        'Row-Level Security (RLS)',
        'Column Encryption (pgcrypto)',
        'Database Schema Isolation'
      ],
      answer: 1
    }
  ]
};
