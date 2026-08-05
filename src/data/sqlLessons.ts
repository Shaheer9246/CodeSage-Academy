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
    philosophy: 'Before databases, companies stored information in messy spreadsheet files. Relational databases—with PostgreSQL being the industry gold-standard for backend engineering—solved this by establishing strict structural order. They organize data into clean tables of rigid rows and columns. Your journey to becoming a backend developer begins with the absolute core statement: retrieving target data out of a table using SQL (Structured Query Language).',
    concepts: [
      {
        title: '1. The Relational Model & PostgreSQL',
        beginner: 'Think of a PostgreSQL database as a highly organized digital filing cabinet. Everything is stored in tables (like a spreadsheet named "employees"). Rows represent individual items (a single employee), while Columns define properties (like name, email, or role).',
        advanced: 'Relational databases are built on the mathematical theory of relations. Every table adheres to a rigid schema. High-performance engines like PostgreSQL enforce strict ACID (Atomicity, Consistency, Isolation, Durability) compliance, preventing corrupt or orphan data from ever entering the storage layer.'
      },
      {
        title: '2. The SELECT and FROM Keywords',
        beginner: 'When your backend application needs to look at data, it sends SQL statements to the database. "SELECT" tells the database exactly which columns to grab, and "FROM" tells it which table holds them. Example: "SELECT name FROM employees;"',
        advanced: 'The SELECT keyword initiates the projection phase of relational algebra. The database query planner parses your request, opens the target relation (FROM table), isolates projected attributes in memory, and returns the dataset over the network without modifying physical disk storage.'
      },
      {
        title: '3. Column Aliasing (AS)',
        beginner: 'Sometimes, backend database columns have ugly technical names like "emp_usr_name". You can temporarily rename a column in your results using the "AS" keyword (e.g., "SELECT emp_usr_name AS username"). This is exactly how backend APIs rename data before sending it to a frontend application.',
        advanced: 'Aliasing assigns temporary virtual identifiers to query outputs. This does not alter the physical table schema in PostgreSQL; it simply maps the output variables during the projection step, which is crucial for resolving naming collisions during table joins.'
      }
    ],
    practical: {
      title: 'Retrieving Employee Roles',
      intro: 'We have seeded a virtual `employees` table containing fields like `id`, `name`, `role`, and `salary`. Your task is to query this database and retrieve only the employee names and their respective roles.',
      steps: [
        'Examine the seeded table. It contains columns for `id`, `name`, `role`, and `salary`.',
        'Write a SQL query that retrieves only two columns: `name` and `role` (in that exact order).',
        'Tell the query engine to pull this data from the `employees` table using the `FROM` keyword.',
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
        explanation: 'The AS keyword is used for "aliasing," which lets you temporarily change the column display label in your results. This is heavily used when formatting API responses.'
      }
    ],
    milestones: [
      'Understand relational table schemas, rows, and columns.',
      'Master projecting specific columns using SELECT.',
      'Use FROM to target explicit database tables.',
      'Employ the AS keyword to dynamically alias column outputs for APIs.'
    ]
  },
  {
    id: 'sql-02',
    order: 2,
    module: 'Relational Foundations',
    icon: '🔍',
    title: 'Precision Filtering & NULL Handling',
    philosophy: 'Pulling every record from a massive PostgreSQL database is incredibly inefficient and will crash your server. To build fast, responsive backend APIs, you must filter data down to exact criteria. We achieve this surgical targeting using the WHERE clause. Furthermore, backend engineers must master handling NULL values—the database\'s strict way of representing completely empty or unknown data.',
    concepts: [
      {
        title: '1. The WHERE Filtering Clause',
        beginner: 'Think of WHERE as a customizable search filter. Instead of dumping 10,000 products onto a screen, writing "WHERE price < 20" restricts your database engine so it only returns items costing less than twenty dollars. This saves massive amounts of server memory.',
        advanced: 'The WHERE clause operates as the selection operator in relational algebra. PostgreSQL\'s execution plan evaluates the boolean expression in the WHERE clause against candidate rows, discarding rows that evaluate to False or Null before they ever reach the projection phase.'
      },
      {
        title: '2. NULL and Three-Valued Logic',
        beginner: 'In databases, a missing piece of info (like a user who never provided an email) is stored as NULL. NULL does not mean zero or an empty string; it means "unknown". You cannot use "=" to find NULLs. You must write "IS NULL" or "IS NOT NULL".',
        advanced: 'PostgreSQL implements strict three-valued logic: True, False, and Unknown (NULL). Comparing any value to NULL using standard operators (like "WHERE email = NULL") evaluates to Unknown, which the WHERE filter drops. You must use monadic predicates (IS NULL).'
      },
      {
        title: '3. COALESCE (Backend Fallbacks)',
        beginner: 'If you want a fallback value for missing info (like showing "No Email" instead of a blank spot), use COALESCE. Example: "COALESCE(email, \'No Email\')" looks at the email, and if it is missing, safely prints your fallback text instead.',
        advanced: 'COALESCE accepts an arbitrary number of arguments and evaluates them sequentially, returning the first non-null expression. This is a highly efficient function for data transformation layers, preventing NullPointerExceptions in your backend application.'
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
        question: 'Why does "WHERE email = NULL" fail to return records with empty emails in PostgreSQL?',
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
    philosophy: 'When a frontend application displays data to a user, it expects an orderly sequence—like lowest price first, or newest sign-ups. Unordered database returns feel chaotic. SQL lets backend developers take absolute command over the data payload size and display hierarchy using sorting variables and exact limit caps.',
    concepts: [
      {
        title: '1. Ordering Results (ORDER BY)',
        beginner: 'The "ORDER BY" clause lets you sort your results. By default, it sorts from lowest to highest (A-Z or 0-9). You can specify "ASC" for ascending, or "DESC" for descending (highest to lowest, like finding the most expensive item).',
        advanced: 'ORDER BY instructs the database engine to perform a sorting pass. In PostgreSQL, if the sorted column is not indexed, the engine performs a costly memory or disk-based Merge Sort. Utilizing B-Tree indices completely bypasses this runtime penalty.'
      },
      {
        title: '2. Limiting Network Payloads (LIMIT)',
        beginner: 'If you have a table with millions of products, sending them all to a mobile app will crash it. "LIMIT" caps the total number of rows returned. Writing "LIMIT 5" guarantees the database only sends 5 rows over the network.',
        advanced: 'LIMIT inserts a truncation operator into the execution plan. Once PostgreSQL hits the specified row threshold, it halts execution immediately, protecting buffer pools from excessive I/O and saving network bandwidth.'
      },
      {
        title: '3. Pagination (OFFSET)',
        beginner: 'When you click "Page 2" on a website, the backend uses OFFSET. "OFFSET 10" tells the database to skip the first ten records and start displaying data from record eleven onwards.',
        advanced: 'OFFSET instructs the database to discard the first N rows. However, PostgreSQL must still compute and traverse those N rows before throwing them away. Because of this, deep offsets (like OFFSET 100000) are heavily discouraged in modern backend engineering in favor of Keyset/Cursor pagination.'
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
        question: 'Why is using high OFFSET values (e.g., OFFSET 100000) bad for backend performance?',
        options: [
          'It deletes the first 100,000 entries from the storage disk',
          'The engine must still read, parse, and evaluate the first 100,000 entries before discarding them',
          'The OFFSET keyword is not supported in modern databases',
          'It forces the database to convert text data into numbers'
        ],
        correctIndex: 1,
        explanation: 'An offset does not skip index evaluation magically. The database must traverse and discard all offset records, creating massive read costs on deep pagination requests.'
      }
    ],
    milestones: [
      'Master sorting datasets numerically and alphabetically using ORDER BY.',
      'Differentiate between ascending (ASC) and descending (DESC) directions.',
      'Control network payloads using LIMIT restrictions to protect APIs.',
      'Understand pagination architectures and the performance cost of OFFSET.'
    ]
  },
  {
    id: 'sql-04',
    order: 4,
    module: 'Relational Foundations',
    icon: '📊',
    title: 'Aggregations & Grouping',
    philosophy: 'A database is not just a storage repository; it is a powerful analytics engine. Backend developers rarely pull raw rows to calculate metrics in their code (like Node.js or Python). Instead, we offload the heavy math to the database. We ask mathematical questions like: "What is the total revenue?" by grouping rows and summarizing them with aggregation calculations.',
    concepts: [
      {
        title: '1. Aggregate Functions',
        beginner: 'Aggregate functions perform math on a whole column of numbers and return a single summary result. The main ones are COUNT() (total items), SUM() (add them all up), AVG() (get the average), MAX() (find the biggest value), and MIN() (find the smallest).',
        advanced: 'Aggregate functions process a set of rows to calculate a single scalar value. High-performance databases optimize these deeply, parsing B-Tree indexes directly when possible to calculate MIN/MAX without ever reading the physical table rows.'
      },
      {
        title: '2. GROUP BY Mechanics',
        beginner: 'If you ask for "SUM(price)", the database adds everything into one number. If you instead want the sum of prices *for each category* (like shoes, shirts, electronics), you add "GROUP BY category". This splits your table into sub-groups before applying the math.',
        advanced: 'GROUP BY aggregates data into distinct bucket segments. PostgreSQL enforce strict grouping rules: any column projected in your SELECT statement *must* either be wrapped inside an aggregate function or specified inside the GROUP BY clause.'
      },
      {
        title: '3. HAVING vs WHERE',
        beginner: 'You cannot use WHERE on aggregated math (like "WHERE AVG(price) > 50") because WHERE filters rows *before* the math happens. To filter after data is grouped and math is completed, you must use the special "HAVING" keyword.',
        advanced: 'WHERE acts as a pre-filter, stripping rows before grouping operations occur. HAVING acts as a post-filter, evaluating conditions against aggregated metric outputs once the grouping hash map is fully constructed.'
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
        question: 'Why does a query like "SELECT category, SUM(price) FROM items;" fail in strict databases like PostgreSQL?',
        options: [
          'SUM() is not a valid SQL keyword',
          'You cannot use columns and mathematical equations together',
          'The category column is not grouped, causing a structural contradiction (one aggregated number paired with many category names)',
          'Items is a reserved keyword in database systems'
        ],
        correctIndex: 2,
        explanation: 'Because SUM() reduces rows to a single output value, strict databases require a GROUP BY clause to define how the un-aggregated columns (like category) should be segmented.'
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
        explanation: 'WHERE acts as a row filter before calculations. HAVING runs after the grouping step, letting you filter the results of your aggregate calculations.'
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
    module: 'Database Data Mutation & Schema',
    icon: '🛡️',
    title: 'Table Constraints & Data Types',
    philosophy: 'A database is a fortress of integrity. If you let bad data leak into your backend—like registering a user without a username, or duplicating an email—your entire application will crash. We prevent this by establishing strong constraints and strict Data Types directly on the database tables during creation.',
    concepts: [
      {
        title: '1. Standard vs PostgreSQL Data Types',
        beginner: 'When creating a table, you must label every column. While basic SQL uses types like INTEGER and TEXT, PostgreSQL gives engineers powerful specific types: VARCHAR (text with a length limit), BOOLEAN (true/false), and JSONB (for storing complex app data).',
        advanced: 'Strict relational systems like PostgreSQL enforce static typing on disk blocks. Defining precise types allows the engine to pre-allocate storage blocks. PostgreSQL also supports advanced types like UUIDs and Arrays, vastly outperforming generic TEXT columns.'
      },
      {
        title: '2. Primary Keys & Auto-Generation',
        beginner: 'Every row needs a unique ID (Primary Key). In standard SQL, you might write "INTEGER PRIMARY KEY". Real-world PostgreSQL backends often use "SERIAL" (which automatically counts 1, 2, 3...) or "UUID" (which generates an un-guessable string of random characters for better security).',
        advanced: 'A Primary Key enforces entity integrity via an automatic Unique B-Tree index. While SQLite uses AUTOINCREMENT, PostgreSQL modernizes this with "GENERATED ALWAYS AS IDENTITY" or the classic "SERIAL" pseudo-type to handle automatic sequence assignment.'
      },
      {
        title: '3. Integrity Constraints',
        beginner: 'Constraints are strict rules you attach to columns. "NOT NULL" means a field can never be left blank. "UNIQUE" means values (like an email address) can never be duplicated. If a user tries to break a rule, the database rejects the action instantly.',
        advanced: 'Constraints are evaluated inline during write operations. If an INSERT or UPDATE violates a constraint, PostgreSQL rolls back the entire execution transaction, returning an integrity exception to the backend API.'
      }
    ],
    practical: {
      title: 'Creating a Secure User Table',
      intro: 'Your objective is to write a SQL statement to create a new database table named `profiles`. It must store an `id` as an `INTEGER PRIMARY KEY`, a `username` as a `TEXT` column that is both unique and cannot be blank, and an `age` as an integer.',
      steps: [
        'Write `CREATE TABLE profiles (` to begin defining your schema.',
        'Define your first column: `id INTEGER PRIMARY KEY`.',
        'Define your second column: `username TEXT UNIQUE NOT NULL` (ensure you separate columns with commas).',
        'Define your third column: `age INTEGER`.',
        'Close the definition with a parenthesis and a semicolon: `);`.'
      ],
      goal: 'Write a schema definition statement creating the "profiles" table enforcing integrity constraints.',
      starterQuery: 'CREATE TABLE profiles (\n  id INTEGER PRIMARY KEY,\n  ',
      solutionQuery: 'CREATE TABLE profiles (\n  id INTEGER PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  age INTEGER\n);',
      seedSql: '' // We start with a clean empty database for creation exercises
    },
    quiz: [
      {
        question: 'What happens if a backend application attempts to insert a duplicate email into a column marked as UNIQUE?',
        options: [
          'The database automatically renames the value with a trailing number',
          'The database rejects the write, throws an integrity error to the backend, and halts execution',
          'The database deletes the older row containing the duplicate value',
          'The value is stored anyway but marked with a warning flag'
        ],
        correctIndex: 1,
        explanation: 'UNIQUE constraints are absolute. Any violating operations are immediately blocked and the transaction is aborted to maintain data integrity.'
      },
      {
        question: 'Which constraint ensures a specific field can never be left empty by a user?',
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
      'Understand how tables are initialized using CREATE TABLE statements.',
      'Differentiate between basic SQL data types and PostgreSQL types (VARCHAR, JSONB).',
      'Secure application data integrity using NOT NULL and UNIQUE attributes.',
      'Understand the role of Primary Keys in identifying distinct backend records.'
    ]
  },

  {
    id: 'sql-06',
    order: 6,
    module: 'Relational Architecture & Joins',
    icon: '🔗',
    title: 'Relational Links & JOINs',
    philosophy: 'The magic of a Relational Database is how separate tables link together. Instead of storing a user\'s name, address, and purchase items inside a single massive row (which is a nightmare to update), backends split them into highly optimized, separate tables. When an API needs to reassemble this data for a frontend application, we use SQL JOIN operations to link records perfectly using ID codes.',
    concepts: [
      {
        title: '1. Keys & Database Normalization',
        beginner: 'To link tables, we use keys. A "Primary Key" is a unique ID inside a table (like User ID #5). A "Foreign Key" is that same ID stored inside a *different* table to mark a relationship (like putting User ID #5 next to a specific order in the Orders table).',
        advanced: 'Normalization splits attributes across entities to eliminate redundant data. Primary keys guarantee entity integrity, while Foreign Keys establish referential integrity constraints. In PostgreSQL, Foreign Keys physically prevent backends from inserting child records if the parent record does not exist.'
      },
      {
        title: '2. The INNER JOIN Command',
        beginner: 'An INNER JOIN is a query that looks at two tables and finds exact matches between them. If you join a Users table and an Orders table, an INNER JOIN returns only the users who have actually placed an order.',
        advanced: 'An INNER JOIN computes the intersection of two datasets. The PostgreSQL query planner evaluates the ON condition across both tables (often utilizing Hash Joins or Nested Loops), discarding any row pairings that do not explicitly satisfy the join condition.'
      },
      {
        title: '3. LEFT JOIN Mechanics',
        beginner: 'Sometimes you want to see a list of ALL users, even if they have not placed any orders yet. A LEFT JOIN returns every single row from your left table, and if there is no match on the right, it simply leaves the order fields empty (showing up as NULL).',
        advanced: 'A LEFT (OUTER) JOIN guarantees that every record from the left-hand table is preserved in the output. If no relational match exists in the right-hand table, its attributes are projected as Null values. This is crucial for backend APIs building sparse data objects.'
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
        explanation: 'An INNER JOIN filters out non-matching records, returning only the intersection where values meet your strict join condition.'
      },
      {
        question: 'If a backend API needs to fetch all customers, regardless of whether they have an order history or not, which JOIN should you use?',
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
    module: 'Database Data Mutation & Schema',
    icon: '📝',
    title: 'Database Modifications & Writes',
    philosophy: 'Reading data is only half the battle. To build actual interactive software—like registering a new user account, changing a password, or deleting an old post—your backend needs to mutate the state of the database. SQL provides explicit commands for inserting, updating, and deleting records safely.',
    concepts: [
      {
        title: '1. Inserting New Rows (INSERT INTO)',
        beginner: 'To append a brand-new row to a table, use "INSERT INTO", specify the target columns in parentheses, and provide their matching values. Example: "INSERT INTO users (username, status) VALUES (\'john_doe\', \'active\');"',
        advanced: 'In PostgreSQL, backends often need the newly generated ID immediately after inserting. We achieve this by appending the "RETURNING" clause (e.g., "INSERT INTO users (...) RETURNING id;"). This prevents the backend from having to run a second SELECT query to find the new row.'
      },
      {
        title: '2. Modifying Rows (UPDATE)',
        beginner: 'To edit rows, use "UPDATE" followed by the table name, write "SET" to assign new values, and use "WHERE" to target specific rows. Be careful! If you omit the WHERE clause, you will accidentally overwrite every single row in your entire table!',
        advanced: 'An UPDATE statement modifies column attributes. To prevent database corruption when multiple users update the same row concurrently, PostgreSQL runs locking transactions (Row-Exclusive locks) on the target pages while updating values.'
      },
      {
        title: '3. Removing Rows (DELETE)',
        beginner: 'To permanently wipe a row, use "DELETE FROM table WHERE id = 5". Just like UPDATE, forgetting the WHERE filter will wipe your table clean. Because deleting is permanent, many backends use "Soft Deletes" instead—updating a "deleted_at" column rather than actually running a DELETE command.',
        advanced: 'DELETE removes pointers to physical rows, marking page space as available for future writes. For ACID transactional safety, PostgreSQL writes to a WAL (Write-Ahead Log) first, ensuring the deletion can be recovered if the server suddenly loses power during the operation.'
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
        question: 'What happens if a backend runs an UPDATE query without a WHERE clause?',
        options: [
          'The database returns an error and refuses to run the query',
          'Only the very first row of the table gets updated',
          'Every single row in that table will be overwritten with the new values',
          'A new row is created at the bottom of the table'
        ],
        correctIndex: 2,
        explanation: 'Without a WHERE clause to filter records, the UPDATE operation targets and overwrites every single row inside the specified table. This is a common and catastrophic bug.'
      },
      {
        question: 'What is a "Soft Delete" in backend engineering?',
        options: [
          'Using the DELETE command but keeping the table structure',
          'Deleting rows when the server load is low',
          'Instead of running DELETE, running an UPDATE to set a "deleted_at" timestamp or "is_active = false" flag',
          'Deleting data from RAM instead of the hard drive'
        ],
        correctIndex: 2,
        explanation: 'A soft delete is a design pattern where data is never physically destroyed using DELETE. Instead, it is updated to appear deleted, preserving historical data for audits.'
      }
    ],
    milestones: [
      'Write and append clean records using the INSERT statement.',
      'Surgically adjust data attributes using UPDATE paired with strict WHERE clauses.',
      'Understand how PostgreSQL handles modifications safely using row locks and WALs.',
      'Appreciate database transactions and the concept of Soft Deletes.'
    ]
  },
  {
    id: 'sql-08',
    order: 8,
    module: 'Relational Architecture & Joins',
    icon: '🏗️',
    title: 'Advanced Queries: Subqueries & CTEs',
    philosophy: 'As software complexity scales, database queries become massive. Attempting to write complex reporting metrics inside a single nested clump results in illegible, unmaintainable code. To write professional, advanced SQL, backend engineers structure complex logic into sequential step-by-step variables called Common Table Expressions (CTEs).',
    concepts: [
      {
        title: '1. What is a Subquery?',
        beginner: 'A subquery is simply a query placed inside another query (wrapped in parentheses). If you want to find the most expensive item, you might write: "SELECT name FROM products WHERE price = (SELECT MAX(price) FROM products);". The inside query runs first to calculate the highest price.',
        advanced: 'Subqueries can be uncorrelated (running once independent of the outer query) or correlated (referencing outer query columns and evaluating row-by-row). PostgreSQL often optimizes subqueries into semi-joins behind the scenes for performance.'
      },
      {
        title: '2. Common Table Expressions (CTEs / WITH Clause)',
        beginner: 'A CTE acts like a temporary variable that holds the output of a query. By writing "WITH popular_items AS (SELECT ...)", you can then query from "popular_items" in your next query block just like it was a real table! This makes long queries incredibly clean and readable.',
        advanced: 'The WITH clause defines a Common Table Expression. PostgreSQL evaluates and constructs the temporary relation in memory. CTEs isolate modular calculations, making nested backend reporting queries vastly easier for teams to review and debug.'
      },
      {
        title: '3. Subqueries vs CTEs',
        beginner: 'Subqueries are written directly inside filters or joins, often burying logic deep inside a query. CTEs are written at the absolute top of your statement. CTEs are heavily preferred in modern backend teams because they allow you to read code sequentially from top-to-bottom.',
        advanced: 'While modern PostgreSQL optimizes both into similar execution plan branches, CTEs support RECURSIVE declarations. Recursive CTEs allow PostgreSQL to traverse hierarchical tree graphs (like threaded comments or organizational charts) entirely within the database.'
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
        explanation: 'The WITH keyword is the SQL standard command used to define CTEs at the very beginning of a query statement.'
      },
      {
        question: 'What is a key structural benefit of using a CTE over a deeply nested Subquery?',
        options: [
          'CTEs run 100 times faster on every hardware server',
          'CTEs prevent databases from locking tables',
          'CTEs organize nested code into a clear, readable top-to-bottom layout for engineering teams',
          'CTEs automatically translate text columns into numbers'
        ],
        correctIndex: 2,
        explanation: 'CTEs isolate modular subqueries at the top of the file, avoiding deeply nested parentheses and significantly improving maintainability for backend engineers.'
      }
    ],
    milestones: [
      'Compose nested subqueries inside conditional WHERE operations.',
      'Structure complex reporting queries using CTE blocks and the WITH statement.',
      'Differentiate between uncorrelated and correlated query behaviors.',
      'Optimize multi-step backend pipelines for high-level analytical readability.'
    ]
  },
  {
    id: 'sql-09',
    order: 9,
    module: 'PostgreSQL & Advanced Analytics',
    icon: '👑',
    title: 'Analytical Window Functions',
    philosophy: 'Standard aggregations using GROUP BY are limiting because they collapse all your individual rows into a single summary. But what if a backend dashboard needs to keep all the original rows, while still calculating a running total or a leaderboard rank? To solve this, PostgreSQL and modern databases use Window Functions.',
    concepts: [
      {
        title: '1. What is a Window Function?',
        beginner: 'A Window Function performs math across a "window" of related rows. Unlike GROUP BY which squashes everything together, Window Functions let you calculate metrics (like averages or ranks) while keeping every single original row in your final output.',
        advanced: 'Window functions evaluate calculations across partition subsets without collapsing the dataset. They operate on a partitioned window of data, utilizing the OVER clause to define the scope of the calculation context while preserving the physical row count.'
      },
      {
        title: '2. ROW_NUMBER() and RANK()',
        beginner: 'If you want to assign a sequential number to rows (1, 2, 3), use ROW_NUMBER(). If you want to rank rows based on a value (like highest sales), use RANK(). If two items tie in sales, RANK() gives them the same rank and skips a number for the next slot.',
        advanced: 'ROW_NUMBER() generates a unique, sequential integer per row within a window partition. RANK() calculates relative positioning. PostgreSQL executes these heavily in memory, making them perfect for leaderboard APIs and complex paginations.'
      },
      {
        title: '3. The OVER and PARTITION BY Clauses',
        beginner: 'To configure your window function, write "OVER()". Inside those parentheses, you can sort your window using "ORDER BY". You can also split your window into smaller groups using "PARTITION BY" (for example, ranking employees *separately* within each of their departments).',
        advanced: 'The OVER clause defines the analytical frame. PARTITION BY segments the data rows into isolated sorting pipelines. If PARTITION BY is omitted, PostgreSQL treats the entire queried dataset as a single window partition.'
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
        explanation: 'Window functions calculate analytical statistics across logical partitions without collapsing or reducing the physical row count in the output.'
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
    module: 'PostgreSQL & Advanced Analytics',
    icon: '⚡',
    title: 'Query Optimization & EXPLAIN',
    philosophy: 'A query that runs instantly on your laptop with 10 rows can take hours and crash a server when run on a production PostgreSQL database with 10 million rows. To write professional-grade backend code, you cannot treat the database as a magic black box. You must learn how to peak inside the engine, read its execution plan, and build high-performance search indexes.',
    concepts: [
      {
        title: '1. Reading Execution Plans (EXPLAIN)',
        beginner: 'If you want to know how a database is actually executing your query under the hood, you write "EXPLAIN" before your query. This forces the database to print out a map showing exactly how it plans to find your data (like whether it is searching efficiently or scanning the whole table slowly).',
        advanced: 'EXPLAIN parses and displays the execution path selected by PostgreSQL\'s cost-based optimizer. It reveals node types like Seq Scans, Index Scans, Hash Joins, and estimated startup/total costs based on table statistics.'
      },
      {
        title: '2. Table Scans vs Index Seeks',
        beginner: 'Imagine looking for a word in a book. A "Table Scan" means reading the entire book cover-to-cover (slow!). An "Index Seek" means looking up the word in the index at the back and jumping straight to the exact page (blazing fast!). We speed up backends by adding Indexes to commonly searched columns.',
        advanced: 'A Sequential Scan traverses raw data pages linearly (O(N) cost), causing massive CPU and I/O bottlenecks. An Index Scan traverses a balanced B-Tree structure (O(log N) cost) to locate target physical row IDs instantly.'
      },
      {
        title: '3. Creating Indexes (CREATE INDEX)',
        beginner: 'To make your queries run incredibly fast on a column, write: "CREATE INDEX idx_logs_level ON logs(level);". The database will now build an index in the background to accelerate all future WHERE queries on that column.',
        advanced: 'CREATE INDEX constructs an external B-Tree index structure pointing to physical rows. While this speeds up SELECT queries dramatically, it introduces a write penalty—every time the backend runs an INSERT, UPDATE, or DELETE, PostgreSQL must also update the index.'
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
        question: 'What information does the EXPLAIN statement provide to a backend engineer?',
        options: [
          'It translates SQL code into Python script blocks',
          'It displays the step-by-step physical execution path the database engine chose to locate data',
          'It counts the total lines of code written inside the editor',
          'It automatically fixes syntax errors in your query'
        ],
        correctIndex: 1,
        explanation: 'EXPLAIN instructs the database optimizer to display its chosen physical execution pathway (scans, index sweeps, sorting methods) without actually modifying data.'
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
      'Differentiate physical performance profiles of Sequential Scans vs Index Scans.',
      'Build custom B-Tree indexing parameters using CREATE INDEX commands.',
      'Balance query execution speeds against write processing costs in backend architectures.'
    ]
  },

  {
    id: 'sql-11',
    order: 11,
    module: 'Advanced PostgreSQL & Backend Architecture',
    icon: '🏦',
    title: 'ACID Transactions',
    philosophy: 'In the real world, backend operations often require multiple database changes at once—like transferring money. If you deduct $100 from Alice, but the server crashes before adding it to Bob, that $100 vanishes forever. PostgreSQL solves this using ACID Transactions, ensuring that a batch of queries either fully succeeds together, or completely rolls back as if nothing ever happened.',
    concepts: [
      {
        title: '1. BEGIN and COMMIT',
        beginner: 'By typing "BEGIN;", you tell the database to pause its normal auto-save feature. You can then run multiple UPDATE or INSERT commands safely. Once you are absolutely sure everything worked, you type "COMMIT;" to save all the changes to the hard drive simultaneously.',
        advanced: 'BEGIN initiates a transaction block, enforcing ACID compliance (Atomicity, Consistency, Isolation, Durability). PostgreSQL acquires necessary row-level locks and logs impending changes to the WAL (Write-Ahead Log) before allowing the final COMMIT operation to permanently alter physical disk pages.'
      },
      {
        title: '2. The ROLLBACK Command',
        beginner: 'If you are in the middle of a transaction (after typing BEGIN) and realize you made a terrible mistake—like updating the wrong user—you can type "ROLLBACK;". The database instantly wipes away all changes made since the transaction started, restoring the previous state.',
        advanced: 'ROLLBACK terminates the current transaction block and discards all pending mutations. Backend APIs heavily wrap database operations in try/catch blocks; if a Node.js or Python server catches an error during a multi-query process, it instantly issues a ROLLBACK to maintain database integrity.'
      },
      {
        title: '3. Deadlocks and Concurrency',
        beginner: 'When two users try to buy the absolute last concert ticket at the exact same millisecond, the database acts as a traffic cop. Transactions force one user to wait in line while the other finishes, preventing double-booking.',
        advanced: 'PostgreSQL uses MVCC (Multi-Version Concurrency Control) to handle thousands of simultaneous transactions. If two transactions attempt to acquire Row-Exclusive locks on the exact same record, one must wait. If they cross-block each other, PostgreSQL detects a "Deadlock" and safely kills one transaction to unfreeze the system.'
      }
    ],
    practical: {
      title: 'A Safe Bank Transfer',
      intro: 'We have an `accounts` table. Alice (id=1) has $500, and Bob (id=2) has $100. Write a transaction block that transfers $100 from Alice to Bob. (Note: in our browser runner, execute these as a single script block).',
      steps: [
        'Start the transaction block by writing `BEGIN TRANSACTION;`.',
        'Write an `UPDATE` statement reducing Alice\'s balance by 100 (`balance = balance - 100 WHERE id = 1;`).',
        'Write a second `UPDATE` statement increasing Bob\'s balance by 100 (`balance = balance + 100 WHERE id = 2;`).',
        'End the block by permanently saving the changes using `COMMIT;`.'
      ],
      goal: 'Execute a multi-step financial transaction safely using BEGIN and COMMIT.',
      starterQuery: 'BEGIN TRANSACTION;\n-- Update Alice here\n\n-- Update Bob here\n\nCOMMIT;',
      solutionQuery: 'BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;',
      seedSql: `
        CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance INTEGER);
        INSERT INTO accounts VALUES (1, 'Alice', 500);
        INSERT INTO accounts VALUES (2, 'Bob', 100);
      `
    },
    quiz: [
      {
        question: 'What is the primary purpose of a database transaction?',
        options: [
          'To speed up query execution times',
          'To ensure that a series of multiple database commands either succeed entirely or fail entirely without leaving partial data',
          'To translate SQL queries into frontend JavaScript',
          'To back up the database to a cloud server'
        ],
        correctIndex: 1,
        explanation: 'Transactions guarantee "Atomicity" (the "A" in ACID). A transaction is an all-or-nothing operation, preventing partial data corruption during multi-step processes or server crashes.'
      },
      {
        question: 'What backend command prevents temporary transaction changes from being permanently saved if an error occurs?',
        options: [
          'DELETE',
          'ABORT',
          'ROLLBACK',
          'UNDO'
        ],
        correctIndex: 2,
        explanation: 'The ROLLBACK command abandons the current transaction block and restores the database to the exact state it was in before the BEGIN command was issued.'
      }
    ],
    milestones: [
      'Understand the critical importance of ACID compliance in financial software.',
      'Control multi-query execution blocks using BEGIN and COMMIT.',
      'Deploy ROLLBACK strategies within backend API error handling.',
      'Appreciate how relational databases manage concurrent traffic and prevent double-booking.'
    ]
  },
  {
    id: 'sql-12',
    order: 12,
    module: 'Advanced PostgreSQL & Backend Architecture',
    icon: '📦',
    title: 'JSON Data in SQL',
    philosophy: 'Historically, relational databases required rigid columns, leading developers to flock to NoSQL (like MongoDB) for flexible, unstructured data. PostgreSQL completely changed the industry by introducing JSONB—allowing developers to store perfectly flexible, nested JSON objects right alongside strict relational columns. You get the best of both worlds.',
    concepts: [
      {
        title: '1. The JSON Data Type',
        beginner: 'Sometimes you don\'t know what data a user will provide. Instead of creating 50 columns for "user_settings" (dark mode, notifications, language), you can store all of it as a single JSON object in one column. Example: {"theme": "dark", "notifications": true}.',
        advanced: 'PostgreSQL provides the "JSONB" (JSON Binary) data type. Unlike raw text, JSONB is parsed and stored in a binary format upon insertion. This makes write times slightly slower, but allows for blazing-fast indexed querying, nested traversal, and inline document modifications without reading the whole object.'
      },
      {
        title: '2. Querying Inside JSON',
        beginner: 'Modern SQL databases let you "reach inside" a JSON column to pull out specific keys. Instead of pulling down the whole massive object, you can write special SQL syntax to ask: "Find all users where the JSON settings column has theme = dark".',
        advanced: 'In PostgreSQL, engineers use the "->" and "->>" operators to traverse JSON paths. "->" returns a JSON object, while "->>" returns raw text. SQLite (often used in local environments) utilizes the `json_extract()` function to achieve similar path traversals.'
      },
      {
        title: '3. SQL vs NoSQL Convergence',
        beginner: 'You no longer have to choose between a strict database (SQL) and a flexible document database (NoSQL). By combining foreign keys with JSON columns, modern applications can safely link data while still allowing for flexible user inputs.',
        advanced: 'JSONB effectively eliminates the need for separate NoSQL databases in many monolithic architectures. Furthermore, PostgreSQL allows you to create GIN (Generalized Inverted Index) indexes directly on JSON keys, meaning searching through millions of flexible JSON documents is functionally instantaneous.'
      }
    ],
    practical: {
      title: 'Extracting User Settings',
      intro: 'We have seeded a `users` table with a standard `id` and a `settings` column containing a JSON string (e.g., `{"theme": "dark", "alerts": true}`). Using SQLite\'s built-in `json_extract` function, find the `id` of the user who has their theme set to "dark".',
      steps: [
        'Select the `id` column from the `users` table.',
        'Add a `WHERE` clause to filter the results.',
        'Use the extraction function to target the JSON key: `json_extract(settings, \'$.theme\')`.',
        'Set the extracted value condition to equal `\'dark\'`.',
        'End with a semicolon.'
      ],
      goal: 'Reach into an unstructured JSON column and filter rows based on a nested JSON key.',
      starterQuery: '-- Write your SQL query here\nSELECT id FROM users WHERE ',
      solutionQuery: "SELECT id FROM users WHERE json_extract(settings, '$.theme') = 'dark';",
      seedSql: `
        CREATE TABLE users (id INTEGER PRIMARY KEY, settings TEXT);
        INSERT INTO users VALUES (1, '{"theme": "light", "alerts": false}');
        INSERT INTO users VALUES (2, '{"theme": "dark", "alerts": true}');
        INSERT INTO users VALUES (3, '{"theme": "system", "alerts": true}');
      `
    },
    quiz: [
      {
        question: 'Why do modern backend architectures heavily utilize PostgreSQL\'s JSONB column type?',
        options: [
          'It automatically translates SQL into JavaScript arrays',
          'It combines the strict relational integrity of SQL with the flexible, document-based storage of NoSQL',
          'JSON data uses 0 bytes of storage space',
          'It is required in order to connect a database to the internet'
        ],
        correctIndex: 1,
        explanation: 'JSONB allows developers to store unstructured document data inside a strict relational table, providing ultimate architectural flexibility without sacrificing relational JOIN capabilities.'
      },
      {
        question: 'What does a GIN index on a JSONB column in PostgreSQL achieve?',
        options: [
          'It encrypts the JSON data for security',
          'It deletes empty JSON keys automatically',
          'It indexes the nested keys inside the JSON document, allowing for instant high-speed searches',
          'It converts JSON arrays into standard relational tables'
        ],
        correctIndex: 2,
        explanation: 'A GIN (Generalized Inverted Index) maps all the keys and values buried inside unstructured JSON documents, turning slow table scans into hyper-fast lookups.'
      }
    ],
    milestones: [
      'Bridge the gap between relational SQL and document-based NoSQL paradigms.',
      'Understand the performance benefits of PostgreSQL JSONB binary storage.',
      'Extract nested keys from JSON blobs using native SQL extraction functions.',
      'Appreciate how unstructured data simplifies modern API payload storage.'
    ]
  },
  {
    id: 'sql-13',
    order: 13,
    module: 'Advanced PostgreSQL & Backend Architecture',
    icon: '🔮',
    title: 'Virtual Tables (Views)',
    philosophy: 'Some queries are absolute monsters—spanning 5 tables, 4 CTEs, and massive math calculations. If your API runs this monster query hundreds of times a minute, it will exhaust your server. Backend engineers solve this by creating "Views"—virtual tables that save complex queries as reusable, instantly callable objects.',
    concepts: [
      {
        title: '1. Standard Views',
        beginner: 'A View is basically a saved search. If you write a huge query to find "Top 100 Premium Customers", you can save it by typing "CREATE VIEW top_customers AS...". After that, you can just query "SELECT * FROM top_customers". It acts exactly like a real table, but it updates dynamically!',
        advanced: 'Standard Views do not store physical data; they store query definitions. Every time an API queries a View, PostgreSQL dynamically executes the underlying query plan. Views act as a powerful abstraction layer, hiding complex database schema logic from frontend reporting tools.'
      },
      {
        title: '2. Materialized Views (PostgreSQL)',
        beginner: 'If a standard View calculates data live every time you call it, a "Materialized View" takes a snapshot of the math and actually saves the results to the hard drive. Querying it is incredibly fast, but you must manually refresh it when the original data changes.',
        advanced: 'Materialized Views compute the query and physically persist the dataset to disk. They are critical for high-volume caching architectures and dashboard analytics. When underlying tables update, engineers must execute a "REFRESH MATERIALIZED VIEW" command (often via a background CRON job) to update the snapshot.'
      },
      {
        title: '3. Security via Views',
        beginner: 'You can use Views to hide sensitive data. If you have an Employees table with salaries and passwords, you can create a View called "public_directory" that only selects names and emails. You can then let other apps read the View without exposing the secret data.',
        advanced: 'Views provide column-level and row-level obfuscation. By revoking table access and only granting API roles SELECT permissions on the View, backend engineers enforce strict Principle of Least Privilege.'
      }
    ],
    practical: {
      title: 'Abstracting Complex Data',
      intro: 'We have an `employees` table. Instead of typing out a filter every time we want to find developers, let\'s save the search. Create a view named `dev_team` that selects all columns from `employees` where the `department` is "Engineering".',
      steps: [
        'Start with the exact syntax: `CREATE VIEW dev_team AS`.',
        'Follow it immediately with your standard query: `SELECT * FROM employees WHERE department = \'Engineering\'`.',
        'End the statement with a semicolon.',
        'This saves the query into the database structure as a virtual table.'
      ],
      goal: 'Create a reusable View abstraction to simplify complex filtering for future API queries.',
      starterQuery: 'CREATE VIEW dev_team AS\n',
      solutionQuery: "CREATE VIEW dev_team AS\nSELECT * FROM employees WHERE department = 'Engineering';",
      seedSql: `
        CREATE TABLE employees (id INTEGER, name TEXT, department TEXT);
        INSERT INTO employees VALUES (1, 'Alice', 'Engineering');
        INSERT INTO employees VALUES (2, 'Bob', 'HR');
        INSERT INTO employees VALUES (3, 'Charlie', 'Engineering');
      `
    },
    quiz: [
      {
        question: 'What is the structural difference between a Standard View and a Materialized View in PostgreSQL?',
        options: [
          'Standard views are for text; Materialized views are for numbers',
          'Standard views calculate data live upon query; Materialized views cache physical snapshot data on the disk for instant retrieval',
          'Standard views can be updated, Materialized views are deleted after one use',
          'There is no difference, they are just two names for the same thing'
        ],
        correctIndex: 1,
        explanation: 'Materialized Views persist physical data arrays to the disk to avoid re-running expensive math. Standard views are purely virtual aliases for live SQL queries.'
      },
      {
        question: 'How can Views be used to improve database security?',
        options: [
          'They automatically encrypt passwords',
          'They require users to log in twice',
          'They can expose safe columns (like names) while entirely omitting sensitive columns (like passwords) from the resulting virtual table',
          'They prevent the database from being turned off'
        ],
        correctIndex: 2,
        explanation: 'By granting external services access only to a restricted View rather than the foundational table, you permanently hide restricted columns from unauthorized applications.'
      }
    ],
    milestones: [
      'Understand how to encapsulate messy, complex query logic into clean Virtual Tables.',
      'Differentiate between live-evaluating Views and physically cached Materialized Views.',
      'Deploy Views as a security abstraction layer to hide sensitive column structures.',
      'Write CREATE VIEW statements to establish reusable database assets.'
    ]
  },
  {
    id: 'sql-14',
    order: 14,
    module: 'Advanced PostgreSQL & Backend Architecture',
    icon: '🤖',
    title: 'Database Triggers',
    philosophy: 'Modern backends need to automate tasks. When a user updates their email, you want to log the old email for security. Instead of writing complex JavaScript to remember to log this on every API route, you can bake a "Trigger" directly into the database. A trigger is a robot that watches for a specific action (like an UPDATE), and automatically runs a second query instantly.',
    concepts: [
      {
        title: '1. What is a Trigger?',
        beginner: 'A trigger is a database automation. You define an event (like "BEFORE INSERT" or "AFTER UPDATE" on a specific table), and tell the database exactly what secondary SQL query it should automatically execute whenever that event happens.',
        advanced: 'Triggers execute procedural functions (like PL/pgSQL in PostgreSQL) in direct response to DML operations. They run within the exact same transaction as the triggering event—meaning if the trigger fails or throws an error, the original user action is safely rolled back.'
      },
      {
        title: '2. OLD and NEW Context',
        beginner: 'When you change data, a trigger can see both the past and the future! Inside a trigger, you can use the word "OLD.email" to see what the email used to be, and "NEW.email" to see what the user just changed it to. This is perfect for building audit logs.',
        advanced: 'The database engine injects special record variables into the trigger\'s execution context. NEW holds the pending row state for INSERT/UPDATE operations, and OLD holds the pre-existing row state for UPDATE/DELETE operations, allowing for complex validation logic.'
      },
      {
        title: '3. Data Validation & Prevention',
        beginner: 'Triggers aren\'t just for logging. A "BEFORE" trigger can inspect data before it gets saved. If a user tries to change their username to something offensive, the database trigger can catch it and reject the update before it ever touches the hard drive.',
        advanced: 'BEFORE triggers can mutate the NEW row data mid-flight (e.g., automatically formatting text to lowercase) or raise explicit database exceptions to completely block illegal transactions at the absolute lowest architectural level.'
      }
    ],
    practical: {
      title: 'Automating an Audit Log',
      intro: 'We have an `accounts` table and an empty `audit_logs` table. We want to create an automated SQLite trigger named `log_deletion`. When someone deletes an account, the trigger should automatically INSERT the deleted user\'s ID into the `audit_logs`.',
      steps: [
        'Write `CREATE TRIGGER log_deletion AFTER DELETE ON accounts`.',
        'Add the `BEGIN` keyword to start the trigger\'s automated action.',
        'Write the action: `INSERT INTO audit_logs (account_id) VALUES (OLD.id);`. Note the use of `OLD.id` to capture the deleted data.',
        'End the trigger block by writing `END;`.'
      ],
      goal: 'Construct a database automation that passively monitors DELETE actions and records them in a secondary log table.',
      starterQuery: 'CREATE TRIGGER log_deletion AFTER DELETE ON accounts\nBEGIN\n  -- Write your INSERT automation here\n  \nEND;',
      solutionQuery: 'CREATE TRIGGER log_deletion AFTER DELETE ON accounts\nBEGIN\n  INSERT INTO audit_logs (account_id) VALUES (OLD.id);\nEND;',
      seedSql: `
        CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT);
        CREATE TABLE audit_logs (log_id INTEGER PRIMARY KEY, account_id INTEGER, action_date DATETIME DEFAULT CURRENT_TIMESTAMP);
        INSERT INTO accounts VALUES (99, 'System Admin');
      `
    },
    quiz: [
      {
        question: 'What is the purpose of the OLD and NEW variables inside a database trigger?',
        options: [
          'They define whether the trigger was created a long time ago or recently',
          'They allow the automation to compare the row\'s pre-existing data (OLD) with the incoming data (NEW) during an update',
          'They backup old tables to the cloud',
          'They switch the database between different versions of SQL'
        ],
        correctIndex: 1,
        explanation: 'OLD and NEW are contextual record variables injected by the database engine, allowing developers to inspect or compare data states as they transition.'
      },
      {
        question: 'What happens if a triggered automation fails (e.g. throws a math error) during an AFTER UPDATE event?',
        options: [
          'The trigger fails, but the user\'s update still saves successfully',
          'The trigger is automatically deleted',
          'Because triggers run in the same transaction, the failure aborts the entire transaction and the user\'s update is rolled back entirely',
          'The database automatically fixes the math error'
        ],
        correctIndex: 2,
        explanation: 'Triggers execute within the same transactional boundary as the triggering event. If the trigger throws an exception, the entire atomic block is rolled back.'
      }
    ],
    milestones: [
      'Understand event-driven architecture directly inside the database layer.',
      'Deploy CREATE TRIGGER statements to automate secondary SQL actions.',
      'Utilize contextual OLD and NEW variables for data auditing.',
      'Appreciate how BEFORE triggers act as a powerful line of defense for data sanitization.'
    ]
  },
  {
    id: 'sql-15',
    order: 15,
    module: 'Advanced PostgreSQL & Backend Architecture',
    icon: '🔐',
    title: 'Multi-Tenant & Security',
    philosophy: 'Imagine building a SaaS application like Shopify. Thousands of different stores share the exact same database. How do you guarantee that Store A can never accidentally view Store B\'s orders? In standard architectures, developers must remember to add "WHERE tenant_id = X" to every single API query. In modern PostgreSQL, we enforce this invisibly using Row-Level Security (RLS).',
    concepts: [
      {
        title: '1. Multi-Tenant Architecture',
        beginner: 'Multi-tenancy means multiple customers (tenants) share one database. To make this work, every single table must have a "tenant_id" column. Every time you save data, you tag it with the user\'s company ID, separating the massive pool of data into distinct ownership blocks.',
        advanced: 'Shared-schema multi-tenancy is the most highly scalable backend architecture, vastly outperforming creating separate databases for every client. However, it places massive responsibility on the application layer to never drop the tenant context during data retrieval.'
      },
      {
        title: '2. Row-Level Security (RLS)',
        beginner: 'Instead of trusting frontend or backend code to always include the "tenant_id" filter, PostgreSQL lets you set a master rule on the table itself. You activate Row-Level Security, which invisibly filters all queries at the database core. If User A logs in, the database simply pretends User B\'s rows do not exist.',
        advanced: 'RLS (Row-Level Security) operates at the database kernel level via Policies. Even if a backend developer executes a raw "SELECT * FROM orders", PostgreSQL evaluates the active connection role and silently appends the security policy, completely mitigating catastrophic cross-tenant data leaks.'
      },
      {
        title: '3. Database Roles & Permissions',
        beginner: 'Databases shouldn\'t have just one master password. A robust backend creates different "Roles". The public API gets a role that can only SELECT data. The background admin server gets a role that can DELETE data. By separating permissions, a hacker who compromises the public API cannot destroy the database.',
        advanced: 'GRANT and REVOKE commands define granular access control lists (ACLs). Combined with RLS, connection roles create a zero-trust environment where the database acts as the ultimate security enforcer, fully independent of the application layer framework.'
      }
    ],
    practical: {
      title: 'Simulating Tenant Isolation',
      intro: 'While SQLite does not support true Row-Level Security, we simulate the concept using strict Views. We have a shared `orders` table. Create a secure view named `my_store_orders` that retrieves all orders, but strictly filters them so `tenant_id = 1`. This isolates the data for Store #1.',
      steps: [
        'Write `CREATE VIEW my_store_orders AS`.',
        'Write a query selecting everything: `SELECT * FROM orders`.',
        'Add the critical multi-tenant isolation clause: `WHERE tenant_id = 1`.',
        'End with a semicolon.'
      ],
      goal: 'Simulate database-level multi-tenant isolation by wrapping shared data in a hard-coded security View.',
      starterQuery: 'CREATE VIEW my_store_orders AS\n',
      solutionQuery: 'CREATE VIEW my_store_orders AS\nSELECT * FROM orders WHERE tenant_id = 1;',
      seedSql: `
        CREATE TABLE orders (id INTEGER PRIMARY KEY, item TEXT, tenant_id INTEGER);
        INSERT INTO orders VALUES (101, 'Coffee Beans', 1);
        INSERT INTO orders VALUES (102, 'Espresso Machine', 2);
        INSERT INTO orders VALUES (103, 'Paper Cups', 1);
        INSERT INTO orders VALUES (104, 'Industrial Grinder', 2);
      `
    },
    quiz: [
      {
        question: 'What is the primary danger of a Shared-Schema Multi-Tenant architecture without Row-Level Security?',
        options: [
          'It limits the database to a maximum of 10 users',
          'If a backend developer forgets to include a "WHERE tenant_id = X" filter in an API route, users could see other companies\' private data',
          'It forces the database to run in single-thread mode',
          'It costs significantly more money than single-tenant databases'
        ],
        correctIndex: 1,
        explanation: 'Data leakage is the biggest risk in multi-tenancy. If the application layer drops the isolation context, cross-tenant data exposure occurs instantly.'
      },
      {
        question: 'How does PostgreSQL Row-Level Security (RLS) mitigate data leakage?',
        options: [
          'By encrypting the entire hard drive',
          'By automatically applying security policies at the database kernel level, invisibly filtering data regardless of the backend API query',
          'By automatically logging off users who query too fast',
          'By separating different tenants onto completely different physical servers'
        ],
        correctIndex: 1,
        explanation: 'RLS acts as an absolute fail-safe. It intercepts all incoming queries and silently applies tenant isolation rules before the data is even retrieved, making accidental data leakage practically impossible.'
      }
    ],
    milestones: [
      'Understand the architecture and scale of Shared-Schema Multi-Tenancy.',
      'Identify the catastrophic risks of application-layer data leakage.',
      'Appreciate how PostgreSQL Row-Level Security (RLS) acts as a kernel-level fail-safe.',
      'Use Roles and Views to enforce the Principle of Least Privilege.'
    ]
  },
  {
    id: 'sql-16',
    order: 16,
    module: 'Database Administration & Scaling',
    icon: '🧹',
    title: 'MVCC & Database Maintenance (VACUUM)',
    philosophy:
      'Relational databases do not actually overwrite data when you run an UPDATE, nor do they instantly destroy it on DELETE. To allow thousands of users to read and write simultaneously without locking the entire system, PostgreSQL uses MVCC (Multi-Version Concurrency Control). It creates new rows and leaves the old ones behind as "dead tuples." Without regular maintenance, these ghost rows will bloat your storage, destroy query performance, and eventually crash the database.',
    concepts: [
      {
        title: '1. Multi-Version Concurrency Control (MVCC)',
        beginner:
          'Imagine two people editing a shared document. Instead of ripping the pencil out of your hand when I want to edit a sentence, the database just makes a copy of the sentence for me to edit, while you keep reading the old one. Once I save, the old sentence is marked as "dead".',
        advanced:
          'MVCC provides transaction isolation without read/write locks. Every transaction is assigned a sequential ID (TXID). An UPDATE operation actually inserts a brand-new row with the current TXID and marks the old row\'s xmax value to indicate it expires after this transaction, leaving a "dead tuple" on the physical disk.'
      },
      {
        title: '2. VACUUM and Dead Tuples',
        beginner:
          'Because dead rows are left behind on the hard drive, your database slowly fills up with invisible garbage. Running the VACUUM command is like taking out the trash. It tells the database to find those dead rows and mark their disk space as available for new data.',
        advanced:
          'A standard VACUUM scans the table pages, identifies dead tuples invisible to all active transactions, and adds their pointers to the Free Space Map (FSM). It does not shrink the physical file size. A VACUUM FULL aggressively rewrites the entire table heap to reclaim OS-level disk space, but requires an exclusive lock that blocks all API traffic.'
      },
      {
        title: '3. Transaction ID Wraparound',
        beginner:
          'Databases use an internal counter to track changes. If a massive database makes billions of changes, the counter will eventually run out of numbers and reset to zero. If this happens without preparation, the database gets confused about what data is old or new, causing catastrophic data loss.',
        advanced:
          'PostgreSQL uses 32-bit transaction IDs. At ~2 billion transactions, the TXID wraps around. PostgreSQL prevents the "wraparound data loss" apocalypse by running a special process called autovacuum which periodically "freezes" old rows, marking them with a special flag indicating they are permanently older than all active transactions.'
      }
    ],
    practical: {
      title: 'Reclaiming Disk Space',
      intro:
        'In this simulation, we have a sessions table where thousands of users have logged in and out, generating massive amounts of deleted rows (dead tuples). Your task is to execute the database maintenance command to sweep the database, rebuild the internal data structures, and free up the wasted space.',
      steps: [
        'Unlike SELECT or UPDATE, database administration commands are often single keywords.',
        'Type the command VACUUM; to initiate the garbage collection sweep.',
        'Note: In production PostgreSQL, you rarely run this manually as a background daemon named autovacuum handles it, but DBAs must know how to trigger it during emergencies.'
      ],
      goal: 'Execute the VACUUM command to clear dead tuples and reclaim disk space.',
      starterQuery: '-- Write your maintenance command here\n',
      solutionQuery: 'VACUUM;',
      seedSql: `CREATE TABLE sessions (id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT); INSERT INTO sessions VALUES (1, 101, 'abc'); INSERT INTO sessions VALUES (2, 102, 'def'); INSERT INTO sessions VALUES (3, 103, 'ghi'); -- Simulate dead tuple creation DELETE FROM sessions WHERE id IN (1, 2);`
    },
    quiz: [
      {
        question:
          'Why does PostgreSQL leave "dead tuples" behind after an UPDATE or DELETE operation?',
        options: [
          'Because deleting data instantly would damage the hard drive',
          'To support MVCC, ensuring other active transactions can still read the old version of the data without being locked out',
          'Because SQL syntax does not have a permanent delete function',
          'To automatically back up the data to the cloud'
        ],
        correctIndex: 1,
        explanation:
          'MVCC avoids locking the database by keeping the old row (tuple) alive just in case another user is currently running a query that started before the data was changed.'
      },
      {
        question:
          'What is the critical difference between a standard VACUUM and a VACUUM FULL in PostgreSQL?',
        options: [
          'VACUUM FULL deletes the entire table; standard VACUUM only deletes empty rows',
          'VACUUM runs on memory; VACUUM FULL runs on the hard drive',
          'Standard VACUUM frees space for future database inserts without locking the table; VACUUM FULL rewrites the physical disk file to shrink its size but locks the table entirely',
          'There is no functional difference'
        ],
        correctIndex: 2,
        explanation:
          'Standard VACUUM is safe for production traffic because it just updates the Free Space Map. VACUUM FULL rewrites the table structure completely, locking out your backend API during the process.'
      }
    ],
    milestones: [
      'Understand the mechanics of Multi-Version Concurrency Control (MVCC).',
      'Identify database bloat caused by dead tuples during high-write operations.',
      'Deploy the VACUUM command to maintain database health and Free Space Maps.',
      'Comprehend the risks of Transaction ID Wraparound in extreme-scale systems.'
    ]
  },
  {
    id: 'sql-17',
    order: 17,
    module: 'Database Administration & Scaling',
    icon: '🗄️',
    title: 'Table Partitioning',
    philosophy:
      'When a single table reaches billions of rows—like tracking 5 years of temperature sensors or financial ledgers—basic B-Tree indexes become massively bloated and slow. Deleting old data takes hours. To scale, DBAs use Table Partitioning: secretly slicing one massive logical table into dozens of smaller physical tables (like dividing by month or region) behind the scenes.',
    concepts: [
      {
        title: '1. What is Declarative Partitioning?',
        beginner:
          'Imagine keeping 10 years of tax receipts in one giant cardboard box. Finding one from 2019 is a nightmare. Partitioning is like buying a filing cabinet with a drawer for each year. Your application still just asks the database for "receipts", but the database engine automatically routes the data to the correct drawer.',
        advanced:
          'PostgreSQL Declarative Partitioning allows you to define a parent logical table that stores no data itself, and multiple child physical tables (partitions) that inherit the schema. The query planner automatically routes INSERTs to the correct physical heap based on predefined partition bounds.'
      },
      {
        title: '2. Partitioning Strategies (Range, List, Hash)',
        beginner:
          'You have to tell the database HOW to divide the data. "Range" splits data by numbers or dates (e.g., Jan, Feb, March). "List" splits data by exact categories (e.g., Store_NY, Store_LA). "Hash" splits data randomly but evenly across a set number of buckets to balance server load.',
        advanced:
          'Range partitioning is dominant for time-series data, allowing instant archival (dropping a partition is an O(1) metadata operation, whereas a massive DELETE is an O(N) WAL-heavy operation). Hash partitioning is used for evenly distributing heavily skewed tenant IDs across physical shards.'
      },
      {
        title: '3. Partition Pruning',
        beginner:
          'The biggest speed boost comes from reading. If your backend asks for data from "March 2026", the database looks at your filing cabinet, completely ignores the other 11 drawers, and only searches the March drawer. This saves massive amounts of time.',
        advanced:
          'Partition Pruning occurs during the query planning phase. The PostgreSQL optimizer evaluates the WHERE clause against the partition boundary definitions. If the constraints prove a partition cannot contain matching rows, the planner entirely excludes that physical table from the execution node graph.'
      }
    ],
    practical: {
      title: 'Simulating Partition Routing',
      intro:
        "While SQLite does not have PostgreSQL's automatic declarative partitioning, DBAs used to simulate it manually (and still do in simpler DBs). We have created two physical child tables: logs_2025 and logs_2026. Your goal is to create a VIEW named all_logs that combines them using UNION ALL, effectively creating a single logical table your API can query.",
      steps: [
        'Start with CREATE VIEW all_logs AS.',
        'Write a query to select everything from the first partition: SELECT * FROM logs_2025.',
        'Add the UNION ALL keyword to glue the next result set to the bottom of the first.',
        'Write the query for the second partition: SELECT * FROM logs_2026.',
        'End with a semicolon.'
      ],
      goal: 'Construct a unified logical View that spans across multiple physical table partitions.',
      starterQuery: 'CREATE VIEW all_logs AS\n',
      solutionQuery:
        'CREATE VIEW all_logs AS\nSELECT * FROM logs_2025\nUNION ALL\nSELECT * FROM logs_2026;',
      seedSql: `CREATE TABLE logs_2025 (id INTEGER PRIMARY KEY, msg TEXT, year INTEGER DEFAULT 2025); CREATE TABLE logs_2026 (id INTEGER PRIMARY KEY, msg TEXT, year INTEGER DEFAULT 2026); INSERT INTO logs_2025 VALUES (1, 'System started', 2025); INSERT INTO logs_2026 VALUES (2, 'User login', 2026);`
    },
    quiz: [
      {
        question:
          'What is the massive administrative benefit of using Range Partitioning for time-series logs?',
        options: [
          'It automatically translates timestamps into different timezones',
          'Instead of running an expensive DELETE query to remove a billion old logs, you can instantly DROP the physical partition table containing that month',
          'It forces the database to compress text files',
          'It prevents hackers from reading time-based data'
        ],
        correctIndex: 1,
        explanation:
          'Dropping a physical partition is a virtually instantaneous file-system operation (O(1)), bypassing the massive MVCC bloat and transaction log overhead of running a standard DELETE query on billions of rows.'
      },
      {
        question: 'What is Partition Pruning?',
        options: [
          'When the database automatically deletes old rows based on a timer',
          'When the database compresses data to save hard drive space',
          'When the query planner evaluates your WHERE clause and completely skips searching physical partitions that it knows cannot contain your target data',
          'When a database administrator manually shuts down unused servers'
        ],
        correctIndex: 2,
        explanation:
          'Partition pruning allows the database engine to completely ignore irrelevant physical tables, reducing disk I/O massively compared to scanning a single monolithic table.'
      }
    ],
    milestones: [
      'Understand the physical limitations of monolithic tables at the billion-row scale.',
      'Differentiate between Range, List, and Hash partitioning architectures.',
      'Leverage partitioning for O(1) data archival and bulk deletion.',
      'Appreciate how the query planner utilizes Partition Pruning for extreme performance.'
    ]
  },
  {
    id: 'sql-18',
    order: 18,
    module: 'Database Administration & Scaling',
    icon: '🧭',
    title: 'Advanced Indexing (BRIN, GiST, pgvector)',
    philosophy:
      'A standard B-Tree index is perfect for sorting numbers or alphabetizing names. However, B-Trees fail completely if you need to search a map for "restaurants within 5 miles," search millions of documents for a specific paragraph, or find AI similarities. To reach true expert status, DBAs deploy specialized mathematical index structures built for specific data shapes.',
    concepts: [
      {
        title: '1. BRIN (Block Range Indexes)',
        beginner:
          'If you have a billion rows of timestamped sensor data, a B-Tree index would be gigantic and consume all your server RAM. A BRIN index is like a cheat sheet. Instead of indexing every single row, it just remembers: "Page 1 contains dates from Jan 1 to Jan 5. Page 2 has Jan 6 to Jan 10." It is incredibly tiny and surprisingly fast.',
        advanced:
          'BRIN is designed for naturally correlated massive datasets. It stores the minimum and maximum values for contiguous physical disk blocks (pages). It sacrifices the exact precision of a B-Tree to achieve a footprint that is often 99% smaller, making it the industry standard for Petabyte-scale append-only logs.'
      },
      {
        title: '2. GiST and Spatial Data (PostGIS)',
        beginner:
          'You cannot sort a 2D map on a 1D list. If Uber needs to find drivers near you, it uses a GiST index. GiST draws invisible "bounding boxes" around geographic areas. If you are searching in Manhattan, the index immediately discards the bounding box for Brooklyn, narrowing the search instantly.',
        advanced:
          'GiST (Generalized Search Tree) allows PostgreSQL to index complex data types like geometric shapes, IP subnets, and overlapping ranges. Paired with the PostGIS extension, it evaluates geometric overlaps (&&), distance boundaries, and polygon intersections at scale.'
      },
      {
        title: '3. AI and pgvector (HNSW)',
        beginner:
          'Artificial Intelligence converts concepts (like sentences or images) into massive lists of numbers called vectors. To find "similar" concepts, you must calculate the distance between these lists. Modern databases use special HNSW indexes to map these vectors into 3D space and quickly navigate to the closest matches.',
        advanced:
          'The pgvector extension introduces vector types to PostgreSQL. Standard exact-nearest-neighbor (KNN) searches require scanning every row. To scale AI RAG (Retrieval-Augmented Generation) pipelines, DBAs deploy HNSW (Hierarchical Navigable Small World) indexes, an approximate nearest-neighbor graph algorithm that trades a tiny bit of accuracy for massive speed.'
      }
    ],
    practical: {
      title: 'Full-Text Search Indexing',
      intro:
        'While we cannot run a spatial GiST index in this browser, we can simulate another advanced index type: Full-Text Search. A B-Tree cannot quickly find a word buried inside a paragraph. We have created an SQLite FTS5 virtual table (an advanced inverted index) named documents. Find the title of any document that contains the word "database".',
      steps: [
        'Select the title column.',
        'Target the specialized documents table.',
        'Instead of using WHERE text = ... or a slow LIKE, use the specialized MATCH operator.',
        "Write your filter as: WHERE documents MATCH 'database'.",
        'End with a semicolon.'
      ],
      goal: 'Query an advanced inverted index to perform high-speed full-text substring search.',
      starterQuery:
        '-- Write your query here using the MATCH operator\nSELECT title FROM documents WHERE ',
      solutionQuery:
        "SELECT title FROM documents WHERE documents MATCH 'database';",
      seedSql: `-- SQLite specific advanced indexing (FTS5 extension) CREATE VIRTUAL TABLE documents USING fts5(title, content); INSERT INTO documents VALUES ('SQL Guide', 'A database is a fortress of integrity.'); INSERT INTO documents VALUES ('CSS Tips', 'Learn to style web pages beautifully.'); INSERT INTO documents VALUES ('Nodejs Intro', 'Build backend servers easily.');`
    },
    quiz: [
      {
        question:
          'When should a DBA choose a BRIN index over a standard B-Tree index?',
        options: [
          'When indexing text columns for autocomplete features',
          'When indexing AI embedding vectors',
          'When indexing massive, naturally ordered time-series data (like logs) where saving RAM and disk space is prioritized over exact precision',
          'When the database is hosted on a Windows server'
        ],
        correctIndex: 2,
        explanation:
          "BRIN is heavily utilized on massive append-only tables (like logs or IoT metrics). Because the data is naturally sorted by time, BRIN's block-range summaries can skip 99% of the table while taking up almost zero RAM."
      },
      {
        question:
          'What is the primary function of a GiST index in a system like PostGIS?',
        options: [
          'To encrypt user passwords dynamically',
          'To efficiently query two-dimensional spatial data, overlapping bounding boxes, and geometric shapes',
          'To translate foreign languages via AI',
          'To enforce multi-tenant Row-Level Security'
        ],
        correctIndex: 1,
        explanation:
          'GiST (Generalized Search Tree) handles multidimensional data that B-Trees cannot process, making it the backbone of geospatial applications, mapping services, and range-overlap tracking.'
      }
    ],
    milestones: [
      'Understand the limitations of B-Tree structures on massive or multidimensional data.',
      'Deploy BRIN indexes to optimize massive time-series logging tables.',
      'Appreciate the role of GiST and PostGIS in modern mapping and spatial backends.',
      'Recognize how pgvector and HNSW indexes power AI similarity search natively inside PostgreSQL.'
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
