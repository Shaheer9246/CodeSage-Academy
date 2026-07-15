export interface SQLConcept {
  title: string;
  beginner: string;
  advanced: string;
}

export interface SQLQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SQLPractical {
  title: string;
  intro: string;
  steps: string[];
  goal: string;
  starterQuery: string;
  solutionQuery: string;
  seedSql: string; // SQLite initialization queries for the browser runner
}

export interface SQLLesson {
  id: string;
  order: number;
  module: string;
  icon: string;
  title: string;
  philosophy: string;
  concepts: SQLConcept[];
  practical: SQLPractical;
  quiz: SQLQuiz[];
  milestones: string[];
}

export const SQL_LESSONS: SQLLesson[] = [
  {
    id: 'sql-01',
    order: 1,
    module: 'Relational Foundations',
    icon: '💾',
    title: 'Relational Databases & SELECT',
    philosophy: 'Before databases, companies stored information in messy spreadsheet files. Relational databases solved this by establishing structural order: organizing data into clean tables of strict rows and columns, linked together by logical relationships. To talk to these structures, we use SQL (Structured Query Language). Your SQL journey begins with the absolute core statement: retrieving target column data out of a table.',
    concepts: [
      {
        title: '1. The Relational Model',
        beginner: 'Think of a relational database as a highly organized digital filing cabinet. Instead of loose documents, everything is stored in tables. A table looks like a spreadsheet with a specific name (like "employees"). Rows represent individual items (a single employee), while Columns define the properties of those items (like name, email, or role).',
        advanced: 'Relational databases are structured around the mathematical theory of relations. Every table adheres to a rigid schema that defines column data types, constraints, and relational mappings. This design prevents corrupt, misaligned, or orphan data from entering the storage layer.'
      },
      {
        title: '2. The SELECT and FROM Keywords',
        beginner: 'When you want to look at your data, you use SQL statements. The word "SELECT" tells the database exactly which columns you want to view, and the word "FROM" tells it which table holds those columns. For example: "SELECT name FROM employees;" grabs only the name column from the employee records.',
        advanced: 'The SELECT keyword initiates the projection phase of relational algebra. The database engine parses your query, opens the target relation (FROM table), isolates the projected attributes (columns), and outputs the resultant dataset without modifying the underlying storage layer.'
      },
      {
        title: '3. Column Aliasing (AS)',
        beginner: 'Sometimes, table columns have technical or ugly names like "emp_usr_name". You can temporarily rename a column in your query results to make it look nicer using the "AS" keyword. Writing "SELECT emp_usr_name AS username" re-labels that column to "username" in your final output.',
        advanced: 'Aliasing (AS) assigns temporary identifiers to query outputs. This does not change physical database schema properties; it simply acts as a display map during the projection step, which is highly useful when joining tables with identical column names.'
      }
    ],
    practical: {
      title: 'Retrieving Employee Roles',
      intro: 'We have seeded a virtual `employees` table containing fields like `id`, `name`, `role`, and `salary`. Your task is to query this table and retrieve only the employee names and their respective roles.',
      steps: [
        'Examine the seeded table. It contains columns for `id`, `name`, `role`, and `salary`.',
        'Write a SQL query that retrieves only two columns: `name` and `role` (in that exact order).',
        'Ensure you tell the query engine to pull this data from the `employees` table using the `FROM` keyword.',
        'Always end your SQL statements with a clean semicolon (`;`).'
      ],
      goal: 'Retrieve only the "name" and "role" columns from the "employees" table.',
      starterQuery: '-- Write your SQL query here\nSELECT ',
      solutionQuery: 'SELECT name, role FROM employees;',
      seedSql: `
        CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, role TEXT, salary INTEGER);
        INSERT INTO employees VALUES (1, 'Alice Smith', 'Lead Engineer', 120000);
        INSERT INTO employees VALUES (2, 'Bob Jones', 'UI Designer', 85000);
        INSERT INTO employees VALUES (3, 'Charlie Brown', 'Database Admin', 95000);
        INSERT INTO employees VALUES (4, 'Diana Prince', 'Product Manager', 110000);
      `
    },
    quiz: [
      {
        question: 'What is the purpose of the FROM keyword in a standard SQL query?',
        options: [
          'It defines the filters applied to rows',
          'It specifies which table containing target data should be queried',
          'It creates a new database table inside the schema',
          'It renames columns to display them nicer'
        ],
        correctIndex: 1,
        explanation: 'The FROM clause tells the query planner exactly which target database table it needs to open to retrieve the requested records.'
      },
      {
        question: 'Which query correctly displays only the "name" column from a table named "users"?',
        options: [
          'GET name FROM users;',
          'SELECT users FROM name;',
          'SELECT name FROM users;',
          'DISPLAY name OF users;'
        ],
        correctIndex: 2,
        explanation: 'SQL syntax dictates the structure "SELECT [columns] FROM [table];" to query data.'
      },
      {
        question: 'How do you temporarily rename a column in your output query results?',
        options: [
          'Using the RENAME keyword',
          'Using the IS keyword',
          'Using the AS keyword',
          'Using the LINK keyword'
        ],
        correctIndex: 2,
        explanation: 'The AS keyword is used for "aliasing," which lets you temporarily change the column display label in your results.'
      }
    ],
    milestones: [
      'Understand relational table schemas, rows, and columns.',
      'Master projecting specific columns using SELECT.',
      'Use FROM to target explicit database tables.',
      'Employ the AS keyword to dynamically alias column outputs.'
    ]
  },
  {
    id: 'sql-02',
    order: 2,
    module: 'Relational Foundations',
    icon: '🔍',
    title: 'Precision Filtering & NULL Handling',
    philosophy: 'Pulling every record from a massive database table is incredibly inefficient. To construct responsive and secure software, you must filter data down to exact criteria. We achieve this surgical targeting using the WHERE clause. Furthermore, we must master handling NULL values—the database way of representing empty or missing data.',
    concepts: [
      {
        title: '1. The WHERE Filtering Clause',
        beginner: 'Think of the WHERE clause as a customizable search filter. Instead of dumping every product in your store onto the screen, writing "WHERE price < 20" restricts your database engine so it only returns items costing less than twenty dollars.',
        advanced: 'The WHERE clause operates as the selection operator in relational algebra. The execution plan evaluates the boolean expression in the WHERE clause sequentially against every candidate row, discarding rows that evaluate to False or Null.'
      },
      {
        title: '2. NULL and Three-Valued Logic',
        beginner: 'In databases, a missing piece of info (like a user who did not provide an email address) is stored as NULL. NULL does not mean zero or an empty string; it means "unknown". Because of this, you cannot use "=" to find NULLs. You must write "IS NULL" or "IS NOT NULL" instead.',
        advanced: 'SQL implements three-valued logic: True, False, and Unknown (NULL). Comparing any value to NULL using logical operators (like "WHERE email = NULL") evaluates to Unknown, which is rejected by the WHERE filter. You must use monadic predicates: IS NULL or IS NOT NULL.'
      },
      {
        title: '3. COALESCE (Fallbacks)',
        beginner: 'If you want to display your data but want a fallback value for missing info (like showing "No Email Provided" instead of a blank spot), you can use COALESCE. For example: "COALESCE(email, \'No Email\')" looks at the email, and if it is missing, prints your fallback text instead.',
        advanced: 'COALESCE accepts an arbitrary number of arguments and evaluates them sequentially, returning the first non-null expression in the argument list. This is highly efficient for data transformation layers.'
      }
    ],
    practical: {
      title: 'Finding Incomplete Accounts',
      intro: 'We have seeded a `users` table containing `id`, `username`, `email`, and `phone`. Some users have not verified their email addresses, resulting in `NULL` values. Write a query to find the usernames of all users who are missing an email address.',
      steps: [
        'Select only the `username` column.',
        'Target the `users` table.',
        'Add a `WHERE` clause check to see if the `email` column is empty.',
        'Remember: do not use `= NULL`. Use the correct monadic syntax: `IS NULL`.',
        'End with a semicolon.'
      ],
      goal: 'Identify all users who have not registered an email address.',
      starterQuery: '-- Write your SQL query here\nSELECT username FROM users WHERE ',
      solutionQuery: 'SELECT username FROM users WHERE email IS NULL;',
      seedSql: `
        CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, phone TEXT);
        INSERT INTO users VALUES (1, 'john_doe', 'john@example.com', '555-0199');
        INSERT INTO users VALUES (2, 'ghost_coder', NULL, '555-0122');
        INSERT INTO users VALUES (3, 'matrix_neo', 'neo@neb.io', NULL);
        INSERT INTO users VALUES (4, 'mystery_guest', NULL, NULL);
      `
    },
    quiz: [
      {
        question: 'Why does "WHERE email = NULL" fail to return records with empty emails?',
        options: [
          'NULL is a reserved command and cannot be written in filter clauses',
          'Database engines interpret NULL comparisons as "Unknown", which always evaluates to false in a filter',
          'You must use double equal signs (==) to compare NULLs',
          'The equal sign can only compare numerical values, not text columns'
        ],
        correctIndex: 1,
        explanation: 'SQL uses three-valued logic. Any direct equality test with NULL yields NULL (Unknown), so you must use monadic predicates like "IS NULL".'
      },
      {
        question: 'What is the function of the COALESCE operator?',
        options: [
          'It combines two database tables together without matching keys',
          'It deletes empty records from your hard drive',
          'It evaluates arguments in order and returns the first non-null value',
          'It converts text rows into capitalized letters'
        ],
        correctIndex: 2,
        explanation: 'COALESCE(val1, val2, ...) sequentially checks its inputs and returns the first value in the list that is NOT NULL.'
      }
    ],
    milestones: [
      'Understand the row-level selection mechanics of WHERE.',
      'Deploy single and multiple conditional assertions using AND/OR.',
      'Master SQL three-valued logic and handle NULL values safely with IS NULL.',
      'Leverage COALESCE to establish clean default fallbacks for null columns.'
    ]
  },
  {
    id: 'sql-03',
    order: 3,
    module: 'Relational Foundations',
    icon: '⏳',
    title: 'Sorting & Boundaries',
    philosophy: 'When users search for items, they expect to see them arranged in a logical sequence—such as lowest price first, newest sign-ups first, or highest ratings. Unordered datasets feel chaotic. SQL lets you take absolute command over the display hierarchy of your outputs using ordering arrays and exact limit caps.',
    concepts: [
      {
        title: '1. Ordering Results (ORDER BY)',
        beginner: 'The "ORDER BY" clause lets you sort your results. By default, it sorts from lowest to highest (A-Z or 0-9). You can specify "ASC" for ascending order, or "DESC" for descending order (highest to lowest, like finding the most expensive item).',
        advanced: 'ORDER BY instructs the database engine to perform a sorting pass on the dataset. If the sorted column is not indexed, the engine may perform an expensive disk-based external merge sort. Utilizing indices completely bypasses this runtime penalty.'
      },
      {
        title: '2. Limiting Results (LIMIT)',
        beginner: 'If you have a table with millions of products, you do not want to load them all at once. The "LIMIT" clause lets you cap the total number of rows returned. Writing "LIMIT 5" guarantees you get exactly five rows back, and no more.',
        advanced: 'The LIMIT clause inserts a truncation operator at the top of the execution plan tree. Once the engine hits the specified row threshold during scanning, it halts execution immediately, protecting buffer pools from excessive I/O.'
      },
      {
        title: '3. Query Offsetting (OFFSET)',
        beginner: 'When you are clicking through pages of search results (like Page 1, Page 2, Page 3), you are using offset values. "OFFSET 10" tells the query to skip the first ten records and start displaying data from record eleven onwards.',
        advanced: 'OFFSET instructs the database engine to discard the first N rows of the sorted output stream. However, the database must still compute, sort, and parse those first N rows before throwing them away, causing queries with deep offsets to execute slowly.'
      }
    ],
    practical: {
      title: 'Top 3 Highest-Price Products',
      intro: 'We have seeded a `stock` table containing columns `id`, `name`, `price`, and `quantity`. Your task is to query this table and return only the `name` and `price` of the top 3 most expensive products.',
      steps: [
        'Select the `name` and `price` columns.',
        'Target the `stock` table.',
        'Sort the results by the `price` column in descending order (`DESC`) so the most expensive item is first.',
        'Limit the final output to exactly `3` records.',
        'End with a semicolon.'
      ],
      goal: 'Identify the top 3 highest-priced items in the store.',
      starterQuery: '-- Write your SQL query here\nSELECT name, price FROM stock ',
      solutionQuery: 'SELECT name, price FROM stock ORDER BY price DESC LIMIT 3;',
      seedSql: `
        CREATE TABLE stock (id INTEGER PRIMARY KEY, name TEXT, price REAL, quantity INTEGER);
        INSERT INTO stock VALUES (1, 'Organic Coffee', 18.50, 40);
        INSERT INTO stock VALUES (2, 'Loose Leaf Tea', 12.00, 65);
        INSERT INTO stock VALUES (3, 'Espresso Machine', 899.99, 5);
        INSERT INTO stock VALUES (4, 'Grinder', 75.00, 12);
        INSERT INTO stock VALUES (5, 'Ceramic Mug', 15.00, 100);
      `
    },
    quiz: [
      {
        question: 'Which clause is used to sort the result set of a query?',
        options: [
          'SORT BY',
          'ORDER BY',
          'GROUP BY',
          'ARRANGE BY'
        ],
        correctIndex: 1,
        explanation: 'The ORDER BY clause is the standardized SQL command used to sort output datasets.'
      },
      {
        question: 'Why can using high OFFSET values (e.g., OFFSET 1000000) be bad for performance?',
        options: [
          'It deletes the first million entries from the storage disk',
          'The engine must still read, parse, and sort the first million skipped entries before discarding them',
          'The OFFSET keyword is not supported in SQLite',
          'It forces the database to convert text data into numbers'
        ],
        correctIndex: 1,
        explanation: 'An offset does not skip index evaluation. The database must traverse and discard all offset records, creating high read costs on massive tables.'
      }
    ],
    milestones: [
      'Master sorting datasets numerically and alphabetically using ORDER BY.',
      'Differentiate between ascending (ASC) and descending (DESC) directions.',
      'Control network and rendering payloads using LIMIT restrictions.',
      'Understand pagination architectures using LIMIT combined with OFFSET.'
    ]
  },
  {
    id: 'sql-04',
    order: 4,
    module: 'Relational Foundations',
    icon: '📊',
    title: 'Aggregations & Grouping',
    philosophy: 'A database is not just a repository; it is an analytics tool. Developers and analysts rarely inspect raw rows when looking for major trends. Instead, we ask mathematical questions: What is the total revenue? How many sign-ups did we get today? We answer these questions by grouping rows together and summarizing them using aggregation calculations.',
    concepts: [
      {
        title: '1. Aggregate Functions',
        beginner: 'Aggregate functions perform math on a whole column of numbers and return a single summary result. The main ones are COUNT() (total items), SUM() (add them all up), AVG() (get the average), MAX() (find the biggest value), and MIN() (find the smallest).',
        advanced: 'Aggregate functions process a set of database rows to calculate a single scalar value. They are heavily optimized by the query planner, parsing indexes directly when possible to bypass reading tables.'
      },
      {
        title: '2. GROUP BY Mechanics',
        beginner: 'If you ask the database for "SUM(price)", it adds up everything into one number. If you instead want to see the sum of prices *for each category* (like shoes, shirts, electronics), you add "GROUP BY category". This splits your table into sub-groups before applying the math.',
        advanced: 'GROUP BY aggregates your data into distinct bucket segments based on unique values in specified columns. Columns projected alongside aggregates in your SELECT statement *must* either be wrapped inside an aggregate function or specified inside the GROUP BY clause.'
      },
      {
        title: '3. HAVING vs WHERE',
        beginner: 'You cannot use the standard WHERE filter on aggregated results (like "WHERE AVG(price) > 50") because WHERE runs *before* the math happens. To filter after data is grouped and aggregated, you must use the special "HAVING" keyword.',
        advanced: 'WHERE acts as a pre-filter, stripping out rows before grouping operations occur. HAVING acts as a post-filter, evaluating conditions against aggregated metric outputs once the GROUP BY operation is complete.'
      }
    ],
    practical: {
      title: 'Counting Inventory by Category',
      intro: 'We have seeded an `inventory` table detailing `id`, `item_name`, `category`, and `quantity`. Your job is to output a list showing each `category` and the total `quantity` of items inside it.',
      steps: [
        'Select the `category` column.',
        'Use the `SUM(quantity)` aggregate function to add up items, and alias it as `total_items`.',
        'Specify `FROM inventory` as your data source.',
        'Add a `GROUP BY` clause targeting the `category` column so the sum runs separately for each category.',
        'Ensure proper semicolon syntax.'
      ],
      goal: 'Output categories paired with the total sum of items in each category under the alias "total_items".',
      starterQuery: '-- Write your SQL query here\nSELECT category, ',
      solutionQuery: 'SELECT category, SUM(quantity) AS total_items FROM inventory GROUP BY category;',
      seedSql: `
        CREATE TABLE inventory (id INTEGER PRIMARY KEY, item_name TEXT, category TEXT, quantity INTEGER);
        INSERT INTO inventory VALUES (1, 'Apples', 'Produce', 150);
        INSERT INTO inventory VALUES (2, 'Carrots', 'Produce', 80);
        INSERT INTO inventory VALUES (3, 'Milk', 'Dairy', 45);
        INSERT INTO inventory VALUES (4, 'Cheese', 'Dairy', 30);
        INSERT INTO inventory VALUES (5, 'Bread', 'Bakery', 60);
      `
    },
    quiz: [
      {
        question: 'Why does a query like "SELECT category, SUM(price) FROM items;" fail in standard SQL engines?',
        options: [
          'SUM() is not a valid SQL keyword',
          'You cannot use columns and mathematical equations together',
          'The category column is not grouped, causing a structural contradiction (one aggregated number paired with many category names)',
          'Items is a reserved keyword in database systems'
        ],
        correctIndex: 2,
        explanation: 'Because SUM() reduces rows to a single output value, SQL requires a GROUP BY clause to define how the un-aggregated columns (like category) should be segmented.'
      },
      {
        question: 'What is the critical structural difference between WHERE and HAVING?',
        options: [
          'WHERE filters before grouping is calculated; HAVING filters after grouping is calculated',
          'WHERE only works on numbers; HAVING only works on text characters',
          'HAVING can only be written at the absolute beginning of a SQL statement',
          'There is no difference; they are interchangeable'
        ],
        correctIndex: 0,
        explanation: 'WHERE acts as a row filter before calculations. HAVING runs after the grouping step, letting you filter aggregated calculations.'
      }
    ],
    milestones: [
      'Master scalar operations using MIN, MAX, SUM, AVG, and COUNT.',
      'Deploy the GROUP BY segmenter to partition tables into metric buckets.',
      'Understand the execution lifecycle order (WHERE -> GROUP BY -> HAVING).',
      'Leverage HAVING expressions to filter aggregate calculations.'
    ]
  },
  {
    id: 'sql-05',
    order: 5,
    module: 'Relational Foundations',
    icon: '🛡️',
    title: 'Table Constraints & Data Types',
    philosophy: 'A database is a fortress of integrity. If you let bad data leak into your database—like registering a user without a username, writing a negative price, or duplicating a unique email—your entire software application will crash. We prevent this by establishing strong constraints and strict data types directly on the database tables themselves.',
    concepts: [
      {
        title: '1. Primary SQL Data Types',
        beginner: 'Unlike dynamic scripting languages, databases expect strict labels for columns. The most common SQLite types are INTEGER (whole numbers), REAL (decimal numbers), TEXT (characters/strings), and BLOB (raw binary, like images).',
        advanced: 'While SQLite uses dynamic type affinity, strict relational systems enforce static typing on disk blocks. Pre-defining column widths and precise floating structures allows the engine to pre-allocate storage blocks and optimize sequential reads.'
      },
      {
        title: '2. Integrity Constraints',
        beginner: 'Constraints are validation rules you attach to columns during table creation. Common ones include "NOT NULL" (fields cannot be left blank), "UNIQUE" (values like usernames cannot be duplicated), and "CHECK" (custom rules, like checking that age is greater than 18).',
        advanced: 'Constraints are evaluated inline during write operations. If an INSERT or UPDATE statement attempts to store data that violates a constraint, the database engine rolls back the execution transaction and returns an integrity exception.'
      },
      {
        title: '3. Foreign Keys & References',
        beginner: 'To link two tables safely, we use a FOREIGN KEY constraint. This is a special rule telling the database: "You cannot link a book to Author ID #10 if Author ID #10 does not actually exist in the Authors table!" This keeps relationships accurate and unbroken.',
        advanced: 'Foreign key constraints enforce referential integrity. When foreign keys are enabled, the relational engine validates matches by doing index sweeps across target primary keys, preventing orphaned child rows.'
      }
    ],
    practical: {
      title: 'Creating a Secure User Table',
      intro: 'Your objective is to write a SQL statement to create a new database table named `profiles`. It must store an `id` as an integer primary key, a `username` as a text column that is both unique and cannot be blank, and an `age` as an integer.',
      steps: [
        'Write `CREATE TABLE profiles (` to begin defining your schema.',
        'Define your first column: `id INTEGER PRIMARY KEY`.',
        'Define your second column: `username TEXT UNIQUE NOT NULL` (ensure you separate columns with commas).',
        'Define your third column: `age INTEGER`.',
        'Close the definition with a parenthesis and a semicolon: `);`.'
      ],
      goal: 'Write a schema definition statement creating the "profiles" table with id, unique/non-empty username, and age.',
      starterQuery: 'CREATE TABLE profiles (\n  id INTEGER PRIMARY KEY,\n  ',
      solutionQuery: 'CREATE TABLE profiles (\n  id INTEGER PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  age INTEGER\n);',
      seedSql: '' // We start with a clean empty database for creation exercises
    },
    quiz: [
      {
        question: 'What happens if a query attempts to insert a duplicate value into a column marked as UNIQUE?',
        options: [
          'The database automatically renames the value with a trailing number',
          'The engine rejects the write, throws an integrity error, and halts execution',
          'The database deletes the older row containing the duplicate value',
          'The value is stored anyway but marked with a red highlight'
        ],
        correctIndex: 1,
        explanation: 'UNIQUE constraints prevent duplicate data values within a column. Any violating operations are immediately blocked and aborted.'
      },
      {
        question: 'Which constraint ensures a specific field can never be left empty?',
        options: [
          'NOT BLANK',
          'REQUIRE',
          'NOT NULL',
          'STRICT'
        ],
        correctIndex: 2,
        explanation: 'The NOT NULL constraint blocks writes that attempt to insert NULL values into the specified column.'
      }
    ],
    milestones: [
      'Learn standard SQL data types (INTEGER, TEXT, REAL, BLOB).',
      'Understand how tables are initialized using CREATE TABLE statements.',
      'Secure data integrity using NOT NULL and UNIQUE attributes.',
      'Establish referential validation frameworks using Foreign Key references.'
    ]
  },
  {
    id: 'sql-06',
    order: 6,
    module: 'Relational Foundations',
    icon: '🔗',
    title: 'Relational Links & JOINs',
    philosophy: 'The magic of a Relational Database is how separate tables can link together. Instead of storing a user\'s name, address, credit card, and purchase items inside a single massive row, we split them up into highly optimized, separate tables. When we need to reassemble this data for our applications, we use SQL JOIN operations to link records together based on matching ID codes.',
    concepts: [
      {
        title: '1. Keys & Database Normalization',
        beginner: 'To link tables, we use keys. A "Primary Key" is a unique ID inside a table (like a user\'s account number). A "Foreign Key" is that same ID stored inside a *different* table to mark a relationship (like putting the user\'s ID inside an orders table).',
        advanced: 'Normalization splits attributes across entities to eliminate redundant data. Primary keys guarantee entity integrity, while foreign keys establish referential integrity constraints between tables.'
      },
      {
        title: '2. The INNER JOIN Command',
        beginner: 'An INNER JOIN is a query that looks at two tables and finds matches between them. If you join a users table and an orders table, an INNER JOIN returns only the records where a user ID in the users table matches a user ID in the orders table.',
        advanced: 'An INNER JOIN computes the intersection of two datasets. It evaluates the ON condition across a Cartesian product of both tables, discarding any row pairings that do not satisfy the condition.'
      },
      {
        title: '3. LEFT JOIN Mechanics',
        beginner: 'Sometimes you want to see a list of ALL users, even if they have not placed any orders yet. A LEFT JOIN returns every single row from your left table, and if there is no match on the right, it simply leaves the order fields empty (showing up as NULL).',
        advanced: 'A LEFT (OUTER) JOIN guarantees that every record from the left-hand table is preserved in the output. If no match exists in the right-hand table, its attributes are projected as Null values.'
      }
    ],
    practical: {
      title: 'Linking Orders to Customers',
      intro: 'We have seeded two tables: `customers` (containing `id` and `name`) and `orders` (containing `id`, `customer_id`, and `amount`). Write a query to list each customer\'s `name` alongside their order `amount`.',
      steps: [
        'Select the `name` column from the `customers` table, and the `amount` column from the `orders` table.',
        'Start with the `customers` table as your source: `FROM customers`.',
        'Add an `INNER JOIN orders` statement to link the orders table.',
        'Specify the linking relationship using `ON`: `customers.id = orders.customer_id`.',
        'End your statement with a semicolon (`;`).'
      ],
      goal: 'Link customers and orders using an INNER JOIN to display customer names alongside their order amounts.',
      starterQuery: '-- Write your SQL query here\nSELECT customers.name, orders.amount FROM customers ',
      solutionQuery: 'SELECT customers.name, orders.amount FROM customers INNER JOIN orders ON customers.id = orders.customer_id;',
      seedSql: `
        CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL);
        INSERT INTO customers VALUES (1, 'Alice');
        INSERT INTO customers VALUES (2, 'Bob');
        INSERT INTO customers VALUES (3, 'Charlie');
        INSERT INTO orders VALUES (101, 1, 150.50);
        INSERT INTO orders VALUES (102, 2, 89.00);
        INSERT INTO orders VALUES (103, 1, 45.25);
      `
    },
    quiz: [
      {
        question: 'What is the behavior of an INNER JOIN?',
        options: [
          'It returns only the rows that have matching values in both tables',
          'It combines all columns from both tables, filling unmatched columns with random numbers',
          'It returns all rows from the left table, even if there are no matches on the right',
          'It deletes unmatched records from your hard drive'
        ],
        correctIndex: 0,
        explanation: 'An INNER JOIN filters out non-matching records, returning only the intersection where values meet your join condition.'
      },
      {
        question: 'If you want to list all customers regardless of whether they have an order, which JOIN should you use?',
        options: [
          'INNER JOIN',
          'LEFT JOIN',
          'RIGHT JOIN',
          'CROSS JOIN'
        ],
        correctIndex: 1,
        explanation: 'A LEFT JOIN keeps every single row from the left table (customers) and populates matching right table attributes (orders) as NULL if there are no matches.'
      }
    ],
    milestones: [
      'Deconstruct relationships using Primary and Foreign keys.',
      'Deploy INNER JOIN statements to reconstruct matching relational rows.',
      'Utilize LEFT OUTER JOIN queries to handle optional relations and identify NULL matches.',
      'Safely construct clear column references across multiple schemas.'
    ]
  },
  {
    id: 'sql-07',
    order: 7,
    module: 'Relational Foundations',
    icon: '📝',
    title: 'Database Modifications & Writes',
    philosophy: 'Reading data is only half the battle. To build actual interactive software—like registering a new user account, changing a password, or deleting an old post—you need to change the state of your database. SQL provides explicit commands for inserting, updating, and deleting records safely.',
    concepts: [
      {
        title: '1. Inserting New Rows (INSERT INTO)',
        beginner: 'To append a brand-new row to a table, use "INSERT INTO", specify the target columns in parentheses, and provide their matching values. For example: "INSERT INTO users (username, status) VALUES (\'john_doe\', \'active\');".',
        advanced: 'An INSERT operation parses your values against schema types, validates integrity constraints (like NOT NULL or UNIQUE values), appends the row to database pages, and updates all index files.'
      },
      {
        title: '2. Modifying Rows (UPDATE)',
        beginner: 'To edit rows already in your table, use "UPDATE" followed by the table name, write "SET" to assign new values, and use "WHERE" to target specific rows. Be careful! If you omit the WHERE clause, you will overwrite every single row in your entire table!',
        advanced: 'An UPDATE statement modifies column attributes within targeted records. To prevent database corruption, relational engines run locking transactions (shared/exclusive locks) on the target pages while updating values.'
      },
      {
        title: '3. Removing Rows (DELETE)',
        beginner: 'To permanently wipe a row out of a table, use "DELETE FROM table WHERE id = 5". Just like UPDATE, if you forget to add the WHERE filter, you will wipe your entire table completely clean!',
        advanced: 'DELETE deletes pointers to the physical rows, marking page space as available for future writes. For transactional safety, database engines often write to a WAL (Write-Ahead Log) first so the deletion can be recovered if the server suddenly crashes.'
      }
    ],
    practical: {
      title: 'Updating User Account Details',
      intro: 'We have seeded a `members` table containing columns `id`, `username`, `email`, and `status`. Your task is to write an update query that changes the `email` of the user with `id = 2` to `\'bob_new@email.com\'`.',
      steps: [
        'Start with the `UPDATE members` statement.',
        'Use the `SET` keyword to specify the target column change: `email = \'bob_new@email.com\'`.',
        'Add a crucial `WHERE` clause to target only the user where `id = 2`.',
        'Ensure proper semicolon syntax.'
      ],
      goal: 'Update Bob\'s email address inside the members table without altering other records.',
      starterQuery: '-- Write your SQL query here\nUPDATE members ',
      solutionQuery: "UPDATE members SET email = 'bob_new@email.com' WHERE id = 2;",
      seedSql: `
        CREATE TABLE members (id INTEGER PRIMARY KEY, username TEXT, email TEXT, status TEXT);
        INSERT INTO members VALUES (1, 'alice_smith', 'alice@email.com', 'active');
        INSERT INTO members VALUES (2, 'bob_jones', 'bob@email.com', 'pending');
        INSERT INTO members VALUES (3, 'charlie_brown', 'charlie@email.com', 'suspended');
      `
    },
    quiz: [
      {
        question: 'What happens if you run an UPDATE query without a WHERE clause?',
        options: [
          'The database returns an error and refuses to run the query',
          'Only the very first row of the table gets updated',
          'Every single row in that table will be overwritten with the new values',
          'A new row is created at the bottom of the table'
        ],
        correctIndex: 2,
        explanation: 'Without a WHERE clause to filter records, the UPDATE operation targets and overwrites every single row inside the specified table.'
      },
      {
        question: 'What is the purpose of a Transaction (using BEGIN and COMMIT) in database systems?',
        options: [
          'It compresses the database size to save disk storage',
          'It guarantees that a sequence of queries must all succeed together, or none of them are saved (atomic safety)',
          'It encrypts database tables using passwords',
          'It translates SQL code into Python code automatically'
        ],
        correctIndex: 1,
        explanation: 'Transactions guarantee Atomicity (the "A" in ACID). If one step of a multi-query process fails, the database rolls back all preceding changes to prevent partial, corrupt states.'
      }
    ],
    milestones: [
      'Write and append clean records using the INSERT statement.',
      'Surgically adjust data attributes using UPDATE paired with WHERE.',
      'Eradicate records safely using the DELETE command.',
      'Appreciate database transactions and the ACID protection principles.'
    ]
  },
  {
    id: 'sql-08',
    order: 8,
    module: 'Relational Foundations',
    icon: '🏗️',
    title: 'Advanced Queries: Subqueries & CTEs',
    philosophy: 'As software complexity scales, queries become massive. Attempting to write everything inside a single nested clump results in illegible code. To write clean, advanced SQL, you must learn to build queries inside other queries (Subqueries) and structure complex logic into sequential step-by-step variables called Common Table Expressions (CTEs).',
    concepts: [
      {
        title: '1. What is a Subquery?',
        beginner: 'A subquery is simply a query placed inside another query (wrapped inside parentheses). For example, if you want to find the most expensive item, you might write: "SELECT name FROM products WHERE price = (SELECT MAX(price) FROM products);". The inside query calculates the highest price, and the outside query finds the product matching it.',
        advanced: 'Subqueries can be uncorrelated (running once independent of the outer query) or correlated (referencing outer query columns and running once per candidate row). The SQL parser optimizes these into semi-joins or hashes whenever possible.'
      },
      {
        title: '2. Common Table Expressions (CTEs / WITH Clause)',
        beginner: 'A CTE acts like a temporary variable that holds the output of a query. By writing "WITH popular_items AS (SELECT ...)", you can then query from "popular_items" in your next query block just like it was a real table! This makes long queries incredibly clean and readable.',
        advanced: 'The WITH clause defines a Common Table Expression. Standard relational engines evaluate and construct the temporary relation in memory. CTEs isolate modular calculations, making nested logic easier to debug.'
      },
      {
        title: '3. Subqueries vs CTEs',
        beginner: 'While both let you query nested data, Subqueries are written directly inside filters or joins. CTEs are written at the absolute top of your statement using the "WITH" keyword. CTEs are heavily preferred in professional environments because they read sequentially from top-to-bottom.',
        advanced: 'Technically, modern database query optimization compiles CTEs and subqueries down to similar execution plan branches. The main difference lies in readability and recursion support—CTEs support RECURSIVE declarations to traverse hierarchical tree graphs.'
      }
    ],
    practical: {
      title: 'Filtering Payments via CTEs',
      intro: 'We have seeded a `payments` table containing `id` and `amount`. Your task is to write a query using a Common Table Expression (CTE) to find all payment records with an amount greater than the overall average payment.',
      steps: [
        'Start your query with a CTE named `avg_pay` using the `WITH` keyword: `WITH avg_pay AS (SELECT AVG(amount) AS value FROM payments)`.',
        'Below your CTE definition, write your main SELECT statement: `SELECT id, amount FROM payments`.',
        'Add a comma join to bring the CTE relation into context: `FROM payments, avg_pay`.',
        'Add a `WHERE` filter ensuring `amount > avg_pay.value`.',
        'Terminate with a semicolon.'
      ],
      goal: 'Find all payments larger than the global average transaction size using a CTE.',
      starterQuery: 'WITH avg_pay AS (\n  SELECT AVG(amount) AS value FROM payments\n)\nSELECT id, amount FROM payments, avg_pay WHERE ',
      solutionQuery: 'WITH avg_pay AS (\n  SELECT AVG(amount) AS value FROM payments\n)\nSELECT id, amount FROM payments, avg_pay WHERE amount > avg_pay.value;',
      seedSql: `
        CREATE TABLE payments (id INTEGER PRIMARY KEY, amount REAL);
        INSERT INTO payments VALUES (1, 120.00);
        INSERT INTO payments VALUES (2, 45.50);
        INSERT INTO payments VALUES (3, 300.00);
        INSERT INTO payments VALUES (4, 15.00);
        INSERT INTO payments VALUES (5, 95.00);
      `
    },
    quiz: [
      {
        question: 'Which keyword is used to declare a Common Table Expression (CTE) in SQL?',
        options: [
          'CTE',
          'DECLARE',
          'WITH',
          'TEMP'
        ],
        correctIndex: 2,
        explanation: 'The WITH keyword is the SQL standard command used to define CTEs at the beginning of a query.'
      },
      {
        question: 'What is a key structural benefit of using a CTE over a nested Subquery?',
        options: [
          'CTEs run 100 times faster on every hardware server',
          'CTEs prevent databases from locking tables',
          'CTEs organize nested code into a clear, readable top-to-bottom layout',
          'CTEs automatically translate text columns into numbers'
        ],
        correctIndex: 2,
        explanation: 'CTEs isolate modular subqueries at the top of the file, avoiding deeply nested parentheses and improving maintainability.'
      }
    ],
    milestones: [
      'Compose nested subqueries inside conditional WHERE operations.',
      'Structure complex queries using CTE blocks and the WITH statement.',
      'Differentiate between uncorrelated and correlated query behaviors.',
      'Optimize multi-step data pipelines for high-level analytical readability.'
    ]
  },
  {
    id: 'sql-09',
    order: 9,
    module: 'Relational Foundations',
    icon: '👑',
    title: 'Analytical Window Functions',
    philosophy: 'Standard aggregations using GROUP BY are limiting because they collapse all your individual rows. What if you want to keep all your rows, but still calculate a running total or calculate a rank (like 1st, 2nd, 3rd place sales)? To solve this, advanced SQL uses Window Functions, which run math across a "window" of related rows without merging them.',
    concepts: [
      {
        title: '1. What is a Window Function?',
        beginner: 'A Window Function performs mathematical calculations across a group of table rows that are related to the current row. Unlike GROUP BY which squashes everything, Window Functions let you calculate metrics while keeping every single original row in your final output.',
        advanced: 'Window functions evaluate calculations across partition subsets without collapsing rows. They operate on a partitioned window of data, utilizing a special OVER clause to define the scope of the calculation context.'
      },
      {
        title: '2. ROW_NUMBER() and RANK()',
        beginner: 'If you want to assign a sequential number to your rows (like 1, 2, 3, 4), use ROW_NUMBER(). If you want to rank rows based on a value (like highest sales), use RANK(). If two items tie, RANK() gives them the same rank and skips a number for the next slot (e.g. 1, 2, 2, 4).',
        advanced: 'ROW_NUMBER() assigns a unique, sequential integer to each row within a window partition. RANK() calculates the rank of each row relative to others, leaving gaps in rank sequencing when ties occur.'
      },
      {
        title: '3. The OVER and PARTITION BY Clauses',
        beginner: 'To configure your window function, write "OVER()". Inside those parentheses, you can sort your window using "ORDER BY". You can also split your window into smaller groups using "PARTITION BY" (for example, ranking employees *separately* within each of their departments).',
        advanced: 'The OVER clause defines the window partition. PARTITION BY segments the data rows into isolated sorting pipelines. If PARTITION BY is omitted, the entire dataset is treated as a single window partition.'
      }
    ],
    practical: {
      title: 'Ranking Store Revenues',
      intro: 'We have seeded a `monthly_sales` table tracking `month`, `revenue`, and `store_id`. Your task is to write a query that lists the columns `month` and `revenue`, along with a new column named `sales_rank` which ranks sales from the highest revenue to the lowest.',
      steps: [
        'Select the `month` and `revenue` columns.',
        'Add the analytical function: `RANK() OVER (ORDER BY revenue DESC)`.',
        'Alias this calculation column as `sales_rank`.',
        'Set your target data source to `monthly_sales`.',
        'End with a semicolon.'
      ],
      goal: 'Use a Window Function to rank monthly revenue from highest to lowest without collapsing rows.',
      starterQuery: '-- Write your SQL query here\nSELECT month, revenue, ',
      solutionQuery: 'SELECT month, revenue, RANK() OVER (ORDER BY revenue DESC) AS sales_rank FROM monthly_sales;',
      seedSql: `
        CREATE TABLE monthly_sales (id INTEGER PRIMARY KEY, month TEXT, revenue REAL);
        INSERT INTO monthly_sales VALUES (1, 'January', 45000.00);
        INSERT INTO monthly_sales VALUES (2, 'February', 62000.00);
        INSERT INTO monthly_sales VALUES (3, 'March', 31000.00);
        INSERT INTO monthly_sales VALUES (4, 'April', 75000.00);
      `
    },
    quiz: [
      {
        question: 'What is the primary operational difference between GROUP BY and Window Functions?',
        options: [
          'Window functions can only calculate averages, while GROUP BY can calculate sums',
          'GROUP BY collapses rows into summary buckets; Window functions retain all original rows while displaying calculations',
          'GROUP BY can only be used on text columns',
          'There is no difference; they are exactly identical'
        ],
        correctIndex: 1,
        explanation: 'Window functions calculate analytical statistics across logical partitions without collapsing the physical row count in the output.'
      },
      {
        question: 'Which clause defines the grouping boundaries inside a Window Function?',
        options: [
          'GROUP BY',
          'SPLIT BY',
          'PARTITION BY',
          'WINDOW BY'
        ],
        correctIndex: 2,
        explanation: 'PARTITION BY is written inside the OVER() clause to split your window calculation context into distinct subsets.'
      }
    ],
    milestones: [
      'Differentiate between analytical window partitions and physical aggregations.',
      'Deploy row numbering sequences using the ROW_NUMBER() generator.',
      'Rank relative parameters using the RANK() ranking matrix.',
      'Structure calculation windows using PARTITION BY and ORDER BY within OVER.'
    ]
  },
  {
    id: 'sql-10',
    order: 10,
    module: 'Relational Foundations',
    icon: '⚡',
    title: 'Query Optimization & EXPLAIN',
    philosophy: 'A query that runs fast on your laptop with 10 rows can take hours when run on a production server with 10 million rows. To write professional-grade SQL, you cannot treat the database as a magic black box. You must learn how to peak inside the engine, read its execution plan, and build high-performance search indexes.',
    concepts: [
      {
        title: '1. Reading Execution Plans (EXPLAIN)',
        beginner: 'If you want to know how a database is actually executing your query under the hood, you can write "EXPLAIN QUERY PLAN" before your query. This forces the database to print out a map showing exactly how it plans to find your data (like whether it is searching through an index or scanning the whole table).',
        advanced: 'EXPLAIN QUERY PLAN parses and displays the execution path selected by the cost-based optimizer. It reveals nested loop joints, hash tables, sorting methods, and physical index usage.'
      },
      {
        title: '2. Table Scans vs Index Seeks',
        beginner: 'Imagine looking for a word in a book. A "Table Scan" means reading the entire book cover-to-cover (slow!). An "Index Seek" means looking up the word in the index at the back and jumping straight to the exact page (blazing fast!). In databases, we speed up queries by creating "Indexes" on columns we search often.',
        advanced: 'A SCAN operator traverses the raw data pages sequentially (O(N) cost). A SEARCH operator traverses a balanced B-Tree index structure (O(log N) cost) to locate target row IDs instantly.'
      },
      {
        title: '3. Creating Indexes (CREATE INDEX)',
        beginner: 'To make your queries run incredibly fast on a column (like looking up logs by log-level), write: "CREATE INDEX idx_logs_level ON logs(level);". The database will now build a B-Tree sorting index in the background to accelerate all future WHERE queries on that column.',
        advanced: 'CREATE INDEX constructs an external B-Tree index structure pointing to physical row IDs. While this speeds up SELECT queries dramatically, it introduces a write overhead for INSERT, UPDATE, and DELETE operations, as the indexes must be updated.'
      }
    ],
    practical: {
      title: 'Explaining a Log Search',
      intro: 'We have seeded a `logs` table containing `id`, `timestamp`, and `level` (like "INFO", "WARN", "ERROR"). Your task is to write a command to inspect the query plan of a search that finds all ERROR level logs.',
      steps: [
        'To view the execution plan, write the keywords `EXPLAIN QUERY PLAN` at the absolute beginning of your statement.',
        'Directly after those keywords, write your standard search query: `SELECT * FROM logs WHERE level = \'ERROR\';`.',
        'End the entire line with a clean semicolon.'
      ],
      goal: 'Inspect the SQLite execution plan for a conditional search query.',
      starterQuery: 'EXPLAIN QUERY PLAN ',
      solutionQuery: "EXPLAIN QUERY PLAN SELECT * FROM logs WHERE level = 'ERROR';",
      seedSql: `
        CREATE TABLE logs (id INTEGER PRIMARY KEY, timestamp TEXT, level TEXT);
        CREATE INDEX idx_logs_level ON logs(level);
        INSERT INTO logs VALUES (1, '2026-07-15 12:00:00', 'INFO');
        INSERT INTO logs VALUES (2, '2026-07-15 12:05:00', 'ERROR');
        INSERT INTO logs VALUES (3, '2026-07-15 12:10:00', 'WARN');
      `
    },
    quiz: [
      {
        question: 'What information does the EXPLAIN QUERY PLAN statement provide?',
        options: [
          'It translates SQL code into Python script blocks',
          'It displays the step-by-step path the database engine takes to locate and fetch data',
          'It counts the total lines of code written inside the editor',
          'It automatically fixes syntax errors in your query'
        ],
        correctIndex: 1,
        explanation: 'EXPLAIN QUERY PLAN instructs the database optimizer to display its chosen physical execution pathway (scans, index sweeps, sorting methods).'
      },
      {
        question: 'What is the runtime complexity of searching an indexed column vs an un-indexed column?',
        options: [
          'Indexed columns require O(N) linear time; un-indexed require O(1) constant time',
          'Both require identical processing time',
          'Indexed columns utilize balanced B-Trees running in O(log N) logarithmic time; un-indexed columns require O(N) sequential table scans',
          'Indexed columns require O(N^2) quadratic processing loops'
        ],
        correctIndex: 2,
        explanation: 'Indexes allow relational engines to bypass complete sequential sweeps, shifting the search profile to highly optimized B-Tree lookups.'
      }
    ],
    milestones: [
      'Deconstruct query processing maps using EXPLAIN statements.',
      'Differentiate physical performance profiles of SCAN vs SEARCH evaluations.',
      'Build custom B-Tree indexing parameters using CREATE INDEX commands.',
      'Balance query execution speeds against write processing costs.'
    ]
  }
];

export const getSqlLessonById = (id: string): SQLLesson | undefined => {
  return SQL_LESSONS.find(l => l.id === id);
};

export const isSqlLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const lesson = getSqlLessonById(id);
  if (!lesson) return false;
  if (lesson.order === 1) return true;

  // Find previous lesson in sequence
  const prevLesson = SQL_LESSONS.find(l => l.order === lesson.order - 1);
  return prevLesson ? completedLessons.includes(prevLesson.id) : false;
};
