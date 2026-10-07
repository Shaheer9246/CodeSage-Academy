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
  verificationStrategy?: 'exact-match' | 'count-only' | 'custom' | string;
  customValidator?: (userRes: any, solRes: any) => boolean;
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
    id: `sql-01`,
    order: 1,
    module: `Relational Foundations`,
    icon: `💾`,
    title: `Relational Databases & SELECT`,
    philosophy: `A relational database is not just a place to store data. It is a system of order. Before databases, applications stored information in messy files, duplicated lists, and fragile spreadsheets. Relational databases solve this by organizing data into tables with clear columns, strict rows, and predictable relationships. Your backend journey begins with the most important question in data engineering: how do I retrieve exactly what I need?`,
    concepts: [
      {
        title: `1. Tables, Rows, and Columns`,
        beginner: `Think of a table like a very clean spreadsheet. Each table has a name, like employees. Each row is one thing, like one employee. Each column is one fact about that thing, like name, role, or salary.`,
        advanced: `A relational table is a typed relation. Columns define attributes and data domains, while rows represent tuples. The schema enforces structure, allowing the database engine to optimize storage, validate writes, and plan efficient reads.`
      },
      {
        title: `2. SELECT Chooses Columns`,
        beginner: `The SELECT keyword tells the database which columns you want to see. If you only need names, ask for names. Do not ask for every column unless you truly need every column.`,
        advanced: `SELECT performs projection in relational algebra. The engine reads the source relation, projects only the requested attributes, and returns the result set. Precise projection reduces network payload, memory usage, and accidental data exposure.`
      },
      {
        title: `3. FROM Chooses the Source Table`,
        beginner: `The FROM keyword tells the database where to look. If you write SELECT name FROM employees, the database knows it should read from the employees table.`,
        advanced: `FROM identifies the target relation for the query planner. Before execution, the planner evaluates available access paths, such as sequential scans or index scans, based on the table and its statistics.`
      },
      {
        title: `4. Aliasing with AS`,
        beginner: `Sometimes a column has an ugly name, like emp_usr_name. You can rename it only in the query result using AS. For example, SELECT emp_usr_name AS username makes the result easier to use.`,
        advanced: `Aliasing creates a temporary output label. It does not mutate the table schema. In backend APIs, aliases are often used to shape database columns into clean JSON keys for frontend clients.`
      }
    ],
    practical: {
      title: `Retrieving Employee Roles`,
      intro: `We have seeded an employees table with columns id, name, role, and salary. Your task is to retrieve only the employee names and roles. This is the backend equivalent of saying: give me exactly these fields, nothing more.`,
      steps: [
        `Look at the seeded employees table. It contains id, name, role, and salary.`,
        `Write a query that selects only two columns: name and role.`,
        `Use FROM to tell the database to read from the employees table.`,
        `End the statement with a semicolon.`,
        `Run the query. You should see four rows returned, including Alice Smith as Lead Engineer and Bob Jones as UI Designer.`
      ],
      goal: `Retrieve only the name and role columns from the employees table.`,
      starterQuery: `-- Write your SQL query here\nSELECT `,
      solutionQuery: `SELECT name, role FROM employees;`,
      seedSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, role TEXT, salary INTEGER); INSERT INTO employees VALUES (1, 'Alice Smith', 'Lead Engineer', 120000); INSERT INTO employees VALUES (2, 'Bob Jones', 'UI Designer', 85000); INSERT INTO employees VALUES (3, 'Charlie Brown', 'Database Admin', 95000); INSERT INTO employees VALUES (4, 'Diana Prince', 'Product Manager', 110000);`
    },
    quiz: [
      {
        question: `What does the FROM clause do in a SQL query?`,
        options: [
          `It filters rows based on a condition`,
          `It specifies the table the query should read from`,
          `It creates a new table permanently`,
          `It renames the result columns`
        ],
        correctIndex: 1,
        explanation: `FROM tells the database which table is the source of the query. Filtering is done by WHERE, renaming output labels is done by AS, and creating tables requires CREATE TABLE.`
      },
      {
        question: `Which query correctly returns only the name column from a users table?`,
        options: [
          `GET name FROM users;`,
          `SELECT users FROM name;`,
          `SELECT name FROM users;`,
          `DISPLAY name OF users;`
        ],
        correctIndex: 2,
        explanation: `SQL uses SELECT to choose columns and FROM to choose the table. SELECT name FROM users; is the correct syntax. The other options use non-standard keywords or reversed structure.`
      },
      {
        question: `What does SELECT name, role FROM employees; return?`,
        options: [
          `All columns from employees`,
          `Only the name column`,
          `Only the role column`,
          `Only the name and role columns`
        ],
        correctIndex: 3,
        explanation: `The query projects exactly two columns: name and role. It does not return salary or id because those columns were not listed in SELECT.`
      },
      {
        question: `What is the purpose of AS in a query like SELECT emp_usr_name AS username?`,
        options: [
          `It permanently renames the column in the table`,
          `It gives the output column a temporary label`,
          `It converts the column into text`,
          `It deletes the original column`
        ],
        correctIndex: 1,
        explanation: `AS creates an alias for the query output only. It does not modify the actual database schema, convert data types, or delete columns.`
      }
    ],
    milestones: [
      `Understand that tables store rows and columns in a structured schema.`,
      `Use SELECT to choose exactly which columns to retrieve.`,
      `Use FROM to identify the source table.`,
      `Use AS to shape query output for cleaner API responses.`
    ]
  },
  {
    id: `sql-02`,
    order: 2,
    module: `Relational Foundations`,
    icon: `🔍`,
    title: `Precision Filtering & NULL Handling`,
    philosophy: `A database with millions of rows is useless if every query returns everything. Backend engineers must ask precise questions: which users are active? Which orders are unpaid? Which records are missing required data? The WHERE clause gives you surgical control, and NULL handling protects you from the silent bugs that happen when missing data is treated like normal data.`,
    concepts: [
      {
        title: `1. The WHERE Clause`,
        beginner: `WHERE is a filter. If you have 10,000 products but only want products under $20, you write WHERE price < 20. The database returns only the rows that pass your test.`,
        advanced: `WHERE is the selection operator in relational algebra. The engine evaluates the predicate against candidate rows and discards rows that evaluate to false or unknown before projection. This reduces I/O, memory, and network transfer.`
      },
      {
        title: `2. AND, OR, and Parentheses`,
        beginner: `You can combine filters. AND means both conditions must be true. OR means at least one condition must be true. When logic gets complex, use parentheses so your meaning is impossible to misunderstand.`,
        advanced: `SQL boolean logic follows operator precedence. Without explicit parentheses, compound predicates can produce unintended results. Professional queries make logical grouping explicit, especially when mixing AND and OR.`
      },
      {
        title: `3. NULL Means Unknown`,
        beginner: `NULL does not mean zero. It does not mean an empty string. It means the value is missing or unknown. Because of that, you cannot safely use equals to find NULL. You must use IS NULL.`,
        advanced: `SQL uses three-valued logic: true, false, and unknown. Comparisons with NULL usually evaluate to unknown, so WHERE email = NULL does not match missing emails. Use IS NULL or IS NOT NULL to test nullability explicitly.`
      },
      {
        title: `4. COALESCE for Fallback Values`,
        beginner: `Sometimes you want to show a backup value when data is missing. COALESCE(email, 'No Email') returns the email if it exists, and returns No Email if the email is NULL.`,
        advanced: `COALESCE evaluates its arguments in order and returns the first non-null value. It is commonly used in API response formatting to prevent null values from leaking into frontends or causing runtime errors.`
      }
    ],
    practical: {
      title: `Finding Incomplete Accounts`,
      intro: `We have seeded a users table with id, username, email, and phone. Some users never provided an email, so their email column is NULL. Your task is to find the usernames of users missing an email address.`,
      steps: [
        `Select only the username column.`,
        `Read from the users table.`,
        `Add a WHERE clause that checks the email column.`,
        `Use IS NULL, not = NULL.`,
        `Run the query. You should see ghost_coder and mystery_guest returned.`
      ],
      goal: `Identify all users whose email is NULL.`,
      starterQuery: `-- Write your SQL query here\nSELECT username FROM users WHERE `,
      solutionQuery: `SELECT username FROM users WHERE email IS NULL;`,
      seedSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, phone TEXT); INSERT INTO users VALUES (1, 'john_doe', 'john@example.com', '555-0199'); INSERT INTO users VALUES (2, 'ghost_coder', NULL, '555-0122'); INSERT INTO users VALUES (3, 'matrix_neo', 'neo@neb.io', NULL); INSERT INTO users VALUES (4, 'mystery_guest', NULL, NULL);`
    },
    quiz: [
      {
        question: `Why does WHERE email = NULL fail to find missing emails?`,
        options: [
          `NULL is a reserved word that can never appear in WHERE`,
          `Comparisons with NULL evaluate to unknown, so IS NULL must be used`,
          `You must use double equals for NULL`,
          `NULL can only be used with numeric columns`
        ],
        correctIndex: 1,
        explanation: `NULL represents unknown data. Equality comparisons with NULL do not return true; they return unknown. Therefore WHERE email = NULL filters out those rows. IS NULL is the correct null test.`
      },
      {
        question: `What does COALESCE(email, 'No Email') do?`,
        options: [
          `Deletes rows where email is NULL`,
          `Returns email if it is not NULL, otherwise returns No Email`,
          `Converts email into a number`,
          `Creates a new email column`
        ],
        correctIndex: 1,
        explanation: `COALESCE returns the first non-null argument. If email exists, it returns email. If email is NULL, it returns the fallback string. It does not delete rows or create columns.`
      },
      {
        question: `What does WHERE price < 20 return?`,
        options: [
          `Rows where price is exactly 20`,
          `Rows where price is greater than 20`,
          `Rows where price is less than 20`,
          `All rows in the table`
        ],
        correctIndex: 2,
        explanation: `The less-than operator filters rows where the price column is below 20. Rows equal to 20 or greater than 20 do not pass the predicate.`
      },
      {
        question: `Why should you use parentheses when combining AND and OR?`,
        options: [
          `They make the query run faster on every database`,
          `They make the logical grouping explicit and prevent precedence bugs`,
          `They automatically remove NULL values`,
          `They convert text into boolean values`
        ],
        correctIndex: 1,
        explanation: `Parentheses clarify which conditions belong together. They do not magically speed up every query or remove NULLs. Their main value is correctness and maintainability.`
      }
    ],
    milestones: [
      `Use WHERE to filter rows precisely.`,
      `Combine conditions safely with AND and OR.`,
      `Understand that NULL means unknown, not zero or empty string.`,
      `Use IS NULL and COALESCE to handle missing data correctly.`
    ]
  },
  {
    id: `sql-03`,
    order: 3,
    module: `Relational Foundations`,
    icon: `⏳`,
    title: `Sorting & Boundaries`,
    philosophy: `Users do not want raw database output. They want the newest posts first, the cheapest products first, or the highest scores at the top. Sorting is how databases become user-friendly. Boundaries are how databases stay fast. LIMIT protects your API from sending too much data, and OFFSET helps with pagination, but deep pagination has hidden performance costs that professional backend engineers must understand.`,
    concepts: [
      {
        title: `1. ORDER BY`,
        beginner: `ORDER BY sorts your result. By default, sorting is usually ascending: A to Z or low to high. You can use DESC to sort descending, such as showing the most expensive products first.`,
        advanced: `ORDER BY introduces a sort operation into the execution plan. If an appropriate index exists, the engine may avoid an explicit sort. Without an index, the database may need to materialize and sort rows in memory or on disk.`
      },
      {
        title: `2. Ascending, Descending, and Tie-Breakers`,
        beginner: `If two products have the same price, sorting only by price may not always give the same order. Add a second sort column, like id or name, to make the order predictable.`,
        advanced: `Deterministic pagination requires stable ordering. If ORDER BY contains non-unique values, add a unique tie-breaker such as the primary key. This prevents rows from shifting across pages when using LIMIT and OFFSET.`
      },
      {
        title: `3. LIMIT Protects the API`,
        beginner: `LIMIT caps the number of rows returned. If you write LIMIT 5, the database sends at most five rows. This prevents huge responses from crashing your backend or frontend.`,
        advanced: `LIMIT is a truncation operator in the execution plan. Once the engine has produced enough rows to satisfy the limit, it can stop returning more rows. This reduces network payload and client memory pressure.`
      },
      {
        title: `4. OFFSET and Pagination Costs`,
        beginner: `OFFSET skips rows. OFFSET 10 skips the first ten rows. This is useful for page two, page three, and so on. But skipping a huge number of rows can still be slow because the database has to process them first.`,
        advanced: `OFFSET forces the engine to generate and discard rows before returning the requested page. Deep offsets can become expensive. Modern backends often prefer keyset pagination, where the query continues from a known cursor such as WHERE id > last_seen_id.`
      }
    ],
    practical: {
      title: `Top 3 Highest-Price Products`,
      intro: `We have seeded a stock table with id, name, price, and quantity. Your task is to return the name and price of the three most expensive products.`,
      steps: [
        `Select the name and price columns.`,
        `Read from the stock table.`,
        `Sort by price in descending order so the most expensive item appears first.`,
        `Limit the result to 3 rows.`,
        `Run the query. You should see Espresso Machine, Grinder, and Organic Coffee returned in that order.`
      ],
      goal: `Return the top three most expensive products using ORDER BY and LIMIT.`,
      starterQuery: `-- Write your SQL query here\nSELECT name, price FROM stock `,
      solutionQuery: `SELECT name, price FROM stock ORDER BY price DESC LIMIT 3;`,
      seedSql: `CREATE TABLE stock (id INTEGER PRIMARY KEY, name TEXT, price REAL, quantity INTEGER); INSERT INTO stock VALUES (1, 'Organic Coffee', 18.50, 40); INSERT INTO stock VALUES (2, 'Loose Leaf Tea', 12.00, 65); INSERT INTO stock VALUES (3, 'Espresso Machine', 899.99, 5); INSERT INTO stock VALUES (4, 'Grinder', 75.00, 12); INSERT INTO stock VALUES (5, 'Ceramic Mug', 15.00, 100);`
    },
    quiz: [
      {
        question: `Which clause sorts query results?`,
        options: [
          `SORT BY`,
          `ORDER BY`,
          `GROUP BY`,
          `ARRANGE BY`
        ],
        correctIndex: 1,
        explanation: `ORDER BY is the standard SQL clause for sorting results. GROUP BY creates aggregate groups, while SORT BY and ARRANGE BY are not standard SQL clauses.`
      },
      {
        question: `What does ORDER BY price DESC do?`,
        options: [
          `Sorts price from lowest to highest`,
          `Sorts price from highest to lowest`,
          `Deletes duplicate prices`,
          `Limits the result to price rows`
        ],
        correctIndex: 1,
        explanation: `DESC means descending, so the largest values appear first. ASC would sort from lowest to highest. ORDER BY does not delete duplicates or limit rows by itself.`
      },
      {
        question: `Why is OFFSET 100000 potentially expensive?`,
        options: [
          `It deletes 100,000 rows permanently`,
          `The database still has to process and discard the first 100,000 rows`,
          `It forces the database to restart`,
          `It converts text columns into numbers`
        ],
        correctIndex: 1,
        explanation: `OFFSET does not magically jump to the end. The engine must evaluate and discard the skipped rows before returning the requested page. This is why deep pagination often uses keyset techniques instead.`
      },
      {
        question: `Why add a unique column like id to ORDER BY during pagination?`,
        options: [
          `To encrypt the page token`,
          `To make the row order stable and deterministic`,
          `To automatically remove NULL values`,
          `To make the query return more rows`
        ],
        correctIndex: 1,
        explanation: `A unique tie-breaker ensures rows with equal sort values do not randomly shift between pages. This prevents duplicate or missing rows in paginated API responses.`
      }
    ],
    milestones: [
      `Sort results using ORDER BY.`,
      `Understand ASC and DESC ordering.`,
      `Use LIMIT to control API payload size.`,
      `Understand OFFSET costs and why stable ordering matters.`
    ]
  },
  {
    id: `sql-04`,
    order: 4,
    module: `Relational Foundations`,
    icon: `📊`,
    title: `Aggregations & Grouping`,
    philosophy: `Backend systems rarely need every raw row. They need answers: total revenue, average order value, number of active users, inventory by category. Aggregation lets the database do the math close to the data. This is faster than pulling rows into application code and safer because the database engine understands grouping rules, NULL behavior, and execution order.`,
    concepts: [
      {
        title: `1. Aggregate Functions`,
        beginner: `Aggregate functions turn many rows into one summary value. COUNT counts rows. SUM adds values. AVG calculates the average. MAX finds the highest value. MIN finds the lowest value.`,
        advanced: `Aggregate functions reduce a set of rows to a scalar value. Engines can optimize some aggregates using indexes, especially MIN and MAX. Understanding NULL behavior is essential because aggregate functions handle NULLs differently.`
      },
      {
        title: `2. COUNT(*) vs COUNT(column)`,
        beginner: `COUNT(*) counts all rows. COUNT(email) counts only rows where email is not NULL. If you want to know how many users are missing email, this difference matters.`,
        advanced: `COUNT(*) measures row cardinality, while COUNT(expression) counts non-null values of that expression. This distinction is critical for data-quality checks and analytics where missing values must be treated separately from present values.`
      },
      {
        title: `3. GROUP BY Creates Buckets`,
        beginner: `If you want the total quantity for each category, you group by category. The database makes one bucket for each category, then calculates the aggregate inside each bucket.`,
        advanced: `GROUP BY partitions rows into grouping sets. Each SELECT column must either appear in GROUP BY or be wrapped in an aggregate function. This rule prevents ambiguous results where one aggregate value would be paired with many unmatched detail values.`
      },
      {
        title: `4. WHERE Filters Before Aggregation, HAVING Filters After`,
        beginner: `WHERE filters rows before grouping and math happen. HAVING filters after the math. If you want categories whose total quantity is greater than 100, you must use HAVING.`,
        advanced: `WHERE is a pre-aggregation predicate. HAVING is a post-aggregation predicate. This execution order is why aggregate results cannot usually be filtered directly in WHERE.`
      }
    ],
    practical: {
      title: `Counting Inventory by Category`,
      intro: `We have seeded an inventory table with id, item_name, category, and quantity. Your task is to output each category and the total quantity of items in that category.`,
      steps: [
        `Select the category column.`,
        `Use SUM(quantity) and alias it as total_items.`,
        `Read from the inventory table.`,
        `Group the results by category.`,
        `Run the query. You should see Produce with 230, Dairy with 75, and Bakery with 60.`
      ],
      goal: `Calculate total inventory quantity per category using GROUP BY.`,
      starterQuery: `-- Write your SQL query here\nSELECT category, `,
      solutionQuery: `SELECT category, SUM(quantity) AS total_items FROM inventory GROUP BY category;`,
      seedSql: `CREATE TABLE inventory (id INTEGER PRIMARY KEY, item_name TEXT, category TEXT, quantity INTEGER); INSERT INTO inventory VALUES (1, 'Apples', 'Produce', 150); INSERT INTO inventory VALUES (2, 'Carrots', 'Produce', 80); INSERT INTO inventory VALUES (3, 'Milk', 'Dairy', 45); INSERT INTO inventory VALUES (4, 'Cheese', 'Dairy', 30); INSERT INTO inventory VALUES (5, 'Bread', 'Bakery', 60);`
    },
    quiz: [
      {
        question: `Why does SELECT category, SUM(price) FROM items; fail in strict SQL databases?`,
        options: [
          `SUM is not a valid function`,
          `You cannot mix columns and functions`,
          `category is not grouped and is not aggregated, creating an ambiguous result`,
          `The table name is invalid`
        ],
        correctIndex: 2,
        explanation: `When using an aggregate like SUM, every non-aggregated selected column must be included in GROUP BY. Otherwise the database cannot decide which category value should be paired with the aggregated result.`
      },
      {
        question: `What is the difference between WHERE and HAVING?`,
        options: [
          `WHERE filters before grouping; HAVING filters after grouping`,
          `WHERE works only on numbers; HAVING works only on text`,
          `HAVING runs before WHERE`,
          `They are identical`
        ],
        correctIndex: 0,
        explanation: `WHERE filters individual rows before aggregation. HAVING filters grouped or aggregated results after GROUP BY has been processed.`
      },
      {
        question: `What does COUNT(email) ignore?`,
        options: [
          `Rows where email is NULL`,
          `All rows in the table`,
          `Rows where email is an empty string`,
          `Duplicate table names`
        ],
        correctIndex: 0,
        explanation: `COUNT(column) counts non-null values only. If email is NULL, that row is not counted by COUNT(email). COUNT(*) would count the row regardless.`
      },
      {
        question: `What does GROUP BY category do?`,
        options: [
          `Deletes duplicate categories`,
          `Creates one aggregate bucket for each distinct category`,
          `Sorts categories alphabetically`,
          `Converts categories into primary keys`
        ],
        correctIndex: 1,
        explanation: `GROUP BY forms groups based on distinct category values. Aggregate functions then calculate one result per group. It does not delete data or change schema keys.`
      }
    ],
    milestones: [
      `Use COUNT, SUM, AVG, MIN, and MAX.`,
      `Understand COUNT(*) versus COUNT(column).`,
      `Use GROUP BY to aggregate by category or segment.`,
      `Understand WHERE versus HAVING execution order.`
    ]
  },
  {
    id: `sql-05`,
    order: 5,
    module: `Database Data Mutation & Schema`,
    icon: `🛡️`,
    title: `Table Constraints & Data Types`,
    philosophy: `A backend is only as trustworthy as its data. If your database allows duplicate emails, blank usernames, or negative ages, your application will eventually produce bugs that feel impossible to debug. Constraints are the database's immune system. They reject bad data immediately, close to the source, instead of relying on every API route to be perfect forever.`,
    concepts: [
      {
        title: `1. Data Types Define Meaning`,
        beginner: `Every column needs a type. INTEGER stores whole numbers. TEXT stores strings. REAL stores decimal-like numbers. Choosing the right type helps the database store, compare, and validate data correctly.`,
        advanced: `Data types affect storage format, comparison semantics, indexing behavior, and query correctness. A price stored as TEXT cannot be safely summed or compared numerically. Strong typing at the schema level prevents many application-layer bugs.`
      },
      {
        title: `2. Primary Keys Identify Rows`,
        beginner: `A primary key uniquely identifies each row. It is like a student ID number. No two rows can have the same primary key, and the database uses it to find records quickly.`,
        advanced: `Primary keys enforce entity integrity and usually create a unique index automatically. They are essential for foreign key relationships, efficient updates, deletes, and stable pagination cursors.`
      },
      {
        title: `3. NOT NULL and UNIQUE`,
        beginner: `NOT NULL means a column cannot be left empty. UNIQUE means no two rows can have the same value in that column. For example, usernames and emails are often UNIQUE.`,
        advanced: `NOT NULL enforces presence. UNIQUE enforces uniqueness. Both are checked during writes. If a constraint fails, the database rejects the operation and returns an integrity error to the application.`
      },
      {
        title: `4. Constraints Are the Final Guard`,
        beginner: `Your backend code should validate data, but app code can have bugs. Database constraints are the last line of defense. Even if bad data gets past the API, the database can still stop it.`,
        advanced: `Database-level constraints provide invariant enforcement independent of application logic. They protect against concurrent writes, multiple services, admin scripts, and future code changes that might forget validation rules.`
      }
    ],
    practical: {
      title: `Creating a Secure User Table`,
      intro: `Your task is to create a profiles table. It must have an id primary key, a username that is unique and cannot be NULL, and an age column.`,
      steps: [
        `Start with CREATE TABLE profiles (.`,
        `Define id INTEGER PRIMARY KEY.`,
        `Define username TEXT UNIQUE NOT NULL.`,
        `Define age INTEGER.`,
        `Close the statement with ); and run it. You should see the table created successfully.`
      ],
      goal: `Create a table with primary key, uniqueness, and NOT NULL constraints.`,
      starterQuery: `CREATE TABLE profiles (\n  id INTEGER PRIMARY KEY,\n  `,
      solutionQuery: `CREATE TABLE profiles (\n  id INTEGER PRIMARY KEY,\n  username TEXT UNIQUE NOT NULL,\n  age INTEGER\n);`,
      seedSql: ``
    },
    quiz: [
      {
        question: `What happens if you insert a duplicate value into a UNIQUE column?`,
        options: [
          `The database adds a number to make it unique`,
          `The database rejects the write with a constraint error`,
          `The database deletes the older row`,
          `The value is saved with a warning`
        ],
        correctIndex: 1,
        explanation: `UNIQUE constraints prevent duplicate values. If the rule is violated, the database rejects the operation. It does not silently rename values or delete existing rows.`
      },
      {
        question: `Which constraint prevents a column from being left empty?`,
        options: [
          `NOT BLANK`,
          `REQUIRE`,
          `NOT NULL`,
          `STRICT`
        ],
        correctIndex: 2,
        explanation: `NOT NULL blocks INSERT or UPDATE operations that would store NULL in the column. NOT BLANK, REQUIRE, and STRICT are not standard SQL constraints for this purpose.`
      },
      {
        question: `What is the main purpose of a primary key?`,
        options: [
          `To encrypt the row`,
          `To uniquely identify each row`,
          `To sort the table automatically`,
          `To compress the database file`
        ],
        correctIndex: 1,
        explanation: `A primary key uniquely identifies rows and enforces entity integrity. It is also used by relationships, updates, deletes, and many pagination strategies.`
      },
      {
        question: `Why are database constraints more reliable than application validation alone?`,
        options: [
          `They run inside the database and protect data even if application code forgets a rule`,
          `They make the frontend faster`,
          `They automatically create API routes`,
          `They remove the need for passwords`
        ],
        correctIndex: 0,
        explanation: `Constraints enforce rules at the storage layer. Application validation is useful for user experience, but database constraints are the final defense against corrupted or inconsistent data.`
      }
    ],
    milestones: [
      `Understand how data types shape storage and validation.`,
      `Use primary keys to uniquely identify rows.`,
      `Apply NOT NULL and UNIQUE constraints.`,
      `Treat database constraints as the final source of data integrity.`
    ]
  },
  {
    id: `sql-06`,
    order: 6,
    module: `Relational Architecture & Joins`,
    icon: `🔗`,
    title: `Relational Links & JOINs`,
    philosophy: `The true power of relational databases is not storing data in one giant table. It is splitting data into focused tables and then reconnecting it when needed. Customers live in one table. Orders live in another. JOINs are how backend engineers reassemble those normalized facts into useful API responses.`,
    concepts: [
      {
        title: `1. Primary Keys and Foreign Keys`,
        beginner: `A primary key is a unique ID for a row, like customer id 1. A foreign key is that same ID stored in another table to create a relationship. For example, an order can have customer_id = 1 to show who placed it.`,
        advanced: `Foreign keys enforce referential integrity. They guarantee that child rows point to valid parent rows. This prevents orphan records and makes relational joins trustworthy.`
      },
      {
        title: `2. INNER JOIN Returns Matches Only`,
        beginner: `INNER JOIN combines two tables, but only where the relationship exists. If you join customers to orders, you only see customers who actually have orders.`,
        advanced: `INNER JOIN computes the intersection of two relations based on the join predicate. Rows without matching counterparts are excluded. This is ideal when only related records are meaningful.`
      },
      {
        title: `3. LEFT JOIN Keeps All Left Rows`,
        beginner: `LEFT JOIN returns every row from the left table, even if there is no match in the right table. If a customer has no orders, the order columns appear as NULL.`,
        advanced: `LEFT OUTER JOIN preserves the left relation. When no right-side match exists, right-side columns project as NULL. This is useful for finding missing relationships, such as customers with zero orders.`
      },
      {
        title: `4. Join Fanout`,
        beginner: `If one customer has many orders, joining customers to orders repeats the customer information for each order. This is normal, but you must understand it, especially before using SUM or COUNT.`,
        advanced: `Join cardinality matters. A one-to-many join can multiply parent rows, causing inflated aggregates. Professional queries often pre-aggregate child rows before joining them to parent tables.`
      }
    ],
    practical: {
      title: `Linking Orders to Customers`,
      intro: `We have seeded two tables: customers and orders. Each order has a customer_id. Your task is to list each customer's name alongside their order amount.`,
      steps: [
        `Select customers.name and orders.amount.`,
        `Start from the customers table.`,
        `Use INNER JOIN to connect the orders table.`,
        `Join on customers.id = orders.customer_id.`,
        `Run the query. You should see Alice with 150.50, Bob with 89.00, and Alice again with 45.25.`
      ],
      goal: `Use INNER JOIN to connect customers and orders through customer_id.`,
      starterQuery: `-- Write your SQL query here\nSELECT customers.name, orders.amount FROM customers `,
      solutionQuery: `SELECT customers.name, orders.amount FROM customers INNER JOIN orders ON customers.id = orders.customer_id;`,
      seedSql: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER, amount REAL); INSERT INTO customers VALUES (1, 'Alice'); INSERT INTO customers VALUES (2, 'Bob'); INSERT INTO customers VALUES (3, 'Charlie'); INSERT INTO orders VALUES (101, 1, 150.50); INSERT INTO orders VALUES (102, 2, 89.00); INSERT INTO orders VALUES (103, 1, 45.25);`
    },
    quiz: [
      {
        question: `What does INNER JOIN return?`,
        options: [
          `Only rows with matching values in both tables`,
          `All rows from the left table no matter what`,
          `All rows from both tables with no condition`,
          `Only NULL rows`
        ],
        correctIndex: 0,
        explanation: `INNER JOIN returns the intersection of matching rows. If either side lacks a match, the row is excluded. LEFT JOIN would preserve all left rows instead.`
      },
      {
        question: `Which JOIN should you use if you need all customers, including customers without orders?`,
        options: [
          `INNER JOIN`,
          `LEFT JOIN`,
          `CROSS JOIN`,
          `GROUP JOIN`
        ],
        correctIndex: 1,
        explanation: `LEFT JOIN keeps every row from the left table. If a customer has no matching order, the order columns become NULL. INNER JOIN would drop customers without orders.`
      },
      {
        question: `What is a foreign key?`,
        options: [
          `A random password for the database`,
          `A column that references the primary key of another table`,
          `A temporary alias`,
          `A type of index that encrypts data`
        ],
        correctIndex: 1,
        explanation: `A foreign key stores a reference to a parent row, usually its primary key. It creates a relationship between tables and can enforce referential integrity.`
      },
      {
        question: `What is join fanout?`,
        options: [
          `When a JOIN deletes duplicate rows automatically`,
          `When one parent row is repeated because it has many matching child rows`,
          `When a database shuts down because of too many joins`,
          `When ORDER BY sorts too slowly`
        ],
        correctIndex: 1,
        explanation: `Fanout happens when a one-to-many relationship multiplies rows during a JOIN. This is expected, but it can distort aggregates if you are not careful.`
      }
    ],
    milestones: [
      `Understand how primary keys and foreign keys create relationships.`,
      `Use INNER JOIN to retrieve only matching records.`,
      `Use LEFT JOIN to preserve left-table rows and detect missing relationships.`,
      `Recognize join fanout before aggregating joined data.`
    ]
  },

  {
    id: `sql-07`,
    order: 7,
    module: `Database Data Mutation & Schema`,
    icon: `📝`,
    title: `Database Modifications & Writes`,
    philosophy: `Reading data is safe. Writing data is where systems gain power and danger at the same time. A backend must insert new users, update account details, deactivate records, and sometimes delete data permanently. Every write changes state, and state changes must be intentional. Professional engineers treat UPDATE and DELETE as controlled operations, not casual commands.`,
    concepts: [
      {
        title: `1. INSERT INTO`,
        beginner: `INSERT adds a new row to a table. You name the table, list the columns you want to fill, and provide matching values. For example, you can add a new user with a username and status.`,
        advanced: `INSERT appends a new tuple to a relation. The engine validates types and constraints, writes the row through the transactional pipeline, and makes it visible according to isolation rules. In many backends, the newly created id is needed immediately for follow-up logic.`
      },
      {
        title: `2. UPDATE with SET and WHERE`,
        beginner: `UPDATE changes existing rows. SET assigns the new value, and WHERE chooses which rows to change. If you forget WHERE, the database updates every row in the table, which is usually a disaster.`,
        advanced: `UPDATE modifies column values on existing tuples. Production-safe updates always include precise predicates, ideally primary key or unique key filters. Backend code should also inspect affected row metadata to confirm whether the intended row was actually changed.`
      },
      {
        title: `3. DELETE and Soft Deletes`,
        beginner: `DELETE removes rows permanently. Because that can be dangerous, many apps use soft deletes instead. A soft delete marks the record as deleted, often with a deleted_at timestamp, without destroying the row.`,
        advanced: `DELETE removes tuple visibility and creates maintenance work for the storage engine. Soft-delete patterns preserve auditability and allow recovery, but they require every query to respect the deleted flag. Hard deletes are still appropriate when retention policy demands physical removal.`
      },
      {
        title: `4. Safe Mutation Workflow`,
        beginner: `Before running UPDATE or DELETE, first run a SELECT with the same WHERE clause. This shows you exactly which rows will be affected. If the result looks correct, then run the mutation.`,
        advanced: `A safe mutation workflow uses preview queries, transactions, and affected-row verification. In critical systems, destructive operations should be scoped by primary key, wrapped in explicit transactions, and logged for auditability.`
      }
    ],
    practical: {
      title: `Updating User Account Details`,
      intro: `We have seeded a members table with id, username, email, and status. Your task is to update the email of the user with id = 2 to bob_new@email.com. The update must affect only that one user.`,
      steps: [
        `Start with UPDATE members.`,
        `Use SET to assign the new email value: email = 'bob_new@email.com'.`,
        `Add WHERE id = 2 so only Bob's row is changed.`,
        `End with a semicolon.`,
        `Run the query. You should see a successful write with no error. If you query the table afterward, only user id 2 should have the new email.`
      ],
      goal: `Update one member's email safely using UPDATE, SET, and WHERE.`,
      starterQuery: `-- Write your SQL query here
UPDATE members `,
      solutionQuery: `UPDATE members SET email = 'bob_new@email.com' WHERE id = 2;`,
      seedSql: `CREATE TABLE members (id INTEGER PRIMARY KEY, username TEXT, email TEXT, status TEXT); INSERT INTO members VALUES (1, 'alice_smith', 'alice@email.com', 'active'); INSERT INTO members VALUES (2, 'bob_jones', 'bob@email.com', 'pending'); INSERT INTO members VALUES (3, 'charlie_brown', 'charlie@email.com', 'suspended');`
    },
    quiz: [
      {
        question: `What happens if you run UPDATE without a WHERE clause?`,
        options: [
          `The database refuses to run the query`,
          `Only the first row is updated`,
          `Every row in the table is updated`,
          `A new row is inserted`
        ],
        correctIndex: 2,
        explanation: `Without WHERE, UPDATE has no row filter, so it applies the SET changes to every row. This is one of the most dangerous mistakes in SQL. It does not insert rows or update only the first row.`
      },
      {
        question: `What is a soft delete?`,
        options: [
          `Deleting the database server`,
          `Marking a record as deleted instead of physically removing it`,
          `Deleting only NULL columns`,
          `A database backup`
        ],
        correctIndex: 1,
        explanation: `A soft delete preserves the row and marks it as deleted, often with deleted_at or is_active. This supports auditing and recovery. It is not a backup and does not delete the server.`
      },
      {
        question: `What should you do before running a risky UPDATE or DELETE?`,
        options: [
          `Run a SELECT with the same WHERE clause to preview affected rows`,
          `Drop the table`,
          `Restart the database`,
          `Remove all indexes`
        ],
        correctIndex: 0,
        explanation: `Previewing the target rows shows what will be changed or removed. Dropping tables, restarting databases, or removing indexes does not make mutation safer and can make things worse.`
      },
      {
        question: `Why is checking affected rows useful after an UPDATE?`,
        options: [
          `It tells whether the expected row was actually changed`,
          `It automatically rolls back the transaction`,
          `It encrypts the updated data`,
          `It creates a new table`
        ],
        correctIndex: 0,
        explanation: `If zero rows were affected, the WHERE clause may not have matched, or the value may already have been the same. Affected-row metadata helps APIs decide between success, not found, and no-op results.`
      }
    ],
    milestones: [
      `Insert new rows using INSERT INTO.`,
      `Update rows safely with SET and WHERE.`,
      `Understand hard deletes versus soft deletes.`,
      `Preview mutations before running them.`
    ]
  },
  {
    id: `sql-08`,
    order: 8,
    module: `Relational Architecture & Joins`,
    icon: `🏗️`,
    title: `Advanced Queries: Subqueries & CTEs`,
    philosophy: `Real backend queries rarely fit into one simple line. They answer questions like: which payments are above average? Which users have orders? Which products are top sellers inside each category? To keep complex SQL readable, engineers break logic into named steps. Subqueries hide steps inside expressions, while Common Table Expressions place steps at the top of the query where humans can read them.`,
    concepts: [
      {
        title: `1. Scalar Subqueries`,
        beginner: `A subquery is a query inside another query. For example, you can find products whose price is greater than the average price. The inner query calculates the average first, and the outer query uses that result.`,
        advanced: `A scalar subquery returns a single value and can appear in SELECT, WHERE, or HAVING clauses. The optimizer may execute it once or rewrite it into a join depending on references and engine capabilities.`
      },
      {
        title: `2. Correlated Subqueries`,
        beginner: `A correlated subquery depends on the outer query. If the inner query says something like “where orders.user_id = users.id,” it may need to run again for each outer row. That can become slow.`,
        advanced: `Correlated subqueries reference columns from the outer query, creating potential row-by-row evaluation. Some engines decorrelate them into semi-joins, but engineers should inspect execution plans when these queries touch large tables.`
      },
      {
        title: `3. Common Table Expressions`,
        beginner: `A CTE is like a temporary named result. You write WITH name AS, put a query inside, and then use that name later in the main query. This makes complex SQL feel like reading steps from top to bottom.`,
        advanced: `The WITH clause defines one or more common table expressions. CTEs improve maintainability by modularizing logic. Depending on the database and version, a CTE may be inlined or materialized, so performance-critical queries should be checked with EXPLAIN.`
      },
      {
        title: `4. CTEs versus Nested Subqueries`,
        beginner: `Nested subqueries can become deeply stacked and hard to read. CTEs let you name each step separately. When debugging, it is much easier to inspect a CTE than to untangle many nested parentheses.`,
        advanced: `CTEs are preferred for multi-step analytics because they create readable logical stages. However, readability must be paired with plan awareness. If a CTE becomes an optimization fence in a particular engine, rewriting as a subquery or join may be necessary.`
      }
    ],
    practical: {
      title: `Filtering Payments via CTEs`,
      intro: `We have seeded a payments table with id and amount. Your task is to use a CTE named avg_pay to calculate the average payment amount, then return all payments whose amount is greater than that average.`,
      steps: [
        `Start with WITH avg_pay AS.`,
        `Inside the CTE, select AVG(amount) and alias it as value.`,
        `After the CTE, select id and amount from payments.`,
        `Bring the CTE into the FROM clause.`,
        `Filter with WHERE amount > avg_pay.value.`,
        `Run the query. You should see the payments above the average amount returned.`
      ],
      goal: `Use a CTE to calculate the average payment and filter payments above that average.`,
      starterQuery: `WITH avg_pay AS (
  SELECT AVG(amount) AS value FROM payments
)
SELECT id, amount FROM payments, avg_pay WHERE `,
      solutionQuery: `WITH avg_pay AS (
  SELECT AVG(amount) AS value FROM payments
)
SELECT id, amount FROM payments, avg_pay WHERE amount > avg_pay.value;`,
      seedSql: `CREATE TABLE payments (id INTEGER PRIMARY KEY, amount REAL); INSERT INTO payments VALUES (1, 120.00); INSERT INTO payments VALUES (2, 45.50); INSERT INTO payments VALUES (3, 300.00); INSERT INTO payments VALUES (4, 15.00); INSERT INTO payments VALUES (5, 95.00);`
    },
    quiz: [
      {
        question: `Which keyword starts a Common Table Expression?`,
        options: [
          `CTE`,
          `WITH`,
          `DECLARE`,
          `TEMP`
        ],
        correctIndex: 1,
        explanation: `WITH introduces CTE definitions. CTE, DECLARE, and TEMP are not the standard SQL keywords for starting a common table expression.`
      },
      {
        question: `What is a major benefit of CTEs over deeply nested subqueries?`,
        options: [
          `They make queries easier to read by naming logical steps`,
          `They always run faster`,
          `They remove the need for WHERE`,
          `They encrypt the query`
        ],
        correctIndex: 0,
        explanation: `CTEs improve clarity by breaking complex logic into named stages. They do not guarantee faster execution, remove filtering needs, or provide encryption.`
      },
      {
        question: `What makes a subquery correlated?`,
        options: [
          `It references a column from the outer query`,
          `It uses ORDER BY`,
          `It returns more than one column`,
          `It uses LIMIT`
        ],
        correctIndex: 0,
        explanation: `A correlated subquery depends on values from the outer query. ORDER BY, LIMIT, and column count do not define correlation.`
      },
      {
        question: `Why should engineers inspect execution plans for large CTE-based queries?`,
        options: [
          `Because some engines may materialize CTEs instead of merging them into the main query`,
          `Because CTEs cannot contain SELECT`,
          `Because CTEs always delete data`,
          `Because CTEs require JSON columns`
        ],
        correctIndex: 0,
        explanation: `Depending on the engine, CTEs may be treated as optimization boundaries. Inspecting the plan reveals whether the CTE is inlined, materialized, or causing unnecessary work. CTEs do not delete data or require JSON.`
      }
    ],
    milestones: [
      `Use scalar subqueries to compute values inside larger queries.`,
      `Recognize correlated subqueries and their performance risks.`,
      `Structure multi-step logic using WITH and CTEs.`,
      `Balance readability with execution-plan awareness.`
    ]
  },
  {
    id: `sql-09`,
    order: 9,
    module: `PostgreSQL & Advanced Analytics`,
    icon: `👑`,
    title: `Analytical Window Functions`,
    philosophy: `GROUP BY is powerful, but it collapses rows. Dashboards often need both: the original rows and calculations across related rows. Window functions solve this. They let you compute ranks, running totals, moving averages, and partitions while preserving each original row. This is one of the most important analytical tools in modern backend SQL.`,
    concepts: [
      {
        title: `1. Window Functions Preserve Rows`,
        beginner: `GROUP BY squeezes many rows into one summary row. A window function calculates a value across related rows but still returns every original row. This is perfect for leaderboards and running totals.`,
        advanced: `Window functions operate over a window of rows defined by OVER. They do not collapse the result set like GROUP BY. This allows analytical calculations to appear alongside detail rows in a single query.`
      },
      {
        title: `2. ROW_NUMBER, RANK, and DENSE_RANK`,
        beginner: `ROW_NUMBER gives each row a unique number: 1, 2, 3, 4. RANK handles ties by giving tied rows the same rank and skipping the next number. DENSE_RANK also handles ties but does not skip numbers.`,
        advanced: `ROW_NUMBER is deterministic when ordered by unique keys. RANK and DENSE_RANK differ in gap behavior after ties. Choosing the correct ranking function matters for pagination, leaderboards, and top-N logic.`
      },
      {
        title: `3. OVER, PARTITION BY, and ORDER BY`,
        beginner: `OVER defines the window. ORDER BY inside OVER controls the order. PARTITION BY splits the window into groups, like ranking sales separately for each store instead of ranking all stores together.`,
        advanced: `PARTITION BY creates independent window partitions. ORDER BY defines row order inside each partition. Without PARTITION BY, the entire result set is treated as one partition.`
      },
      {
        title: `4. Frames and Filtering Window Results`,
        beginner: `A window can include only nearby rows, like the current row and the previous two rows. Also, you usually cannot filter a window function directly with WHERE. You need to wrap the query in a CTE or subquery first.`,
        advanced: `Frame clauses such as ROWS BETWEEN define moving windows for running totals and moving averages. Because window functions are evaluated after WHERE and GROUP BY, filtering on their output requires a derived table or CTE.`
      }
    ],
    practical: {
      title: `Ranking Store Revenues`,
      intro: `We have seeded a monthly_sales table with month and revenue. Your task is to return month, revenue, and a sales_rank column that ranks revenue from highest to lowest.`,
      steps: [
        `Select month and revenue.`,
        `Add RANK() OVER (ORDER BY revenue DESC).`,
        `Alias the window calculation as sales_rank.`,
        `Read from monthly_sales.`,
        `Run the query. You should see April ranked first because it has the highest revenue.`
      ],
      goal: `Use a window function to rank monthly revenue without collapsing rows.`,
      starterQuery: `-- Write your SQL query here
SELECT month, revenue, `,
      solutionQuery: `SELECT month, revenue, RANK() OVER (ORDER BY revenue DESC) AS sales_rank FROM monthly_sales;`,
      seedSql: `CREATE TABLE monthly_sales (id INTEGER PRIMARY KEY, month TEXT, revenue REAL); INSERT INTO monthly_sales VALUES (1, 'January', 45000.00); INSERT INTO monthly_sales VALUES (2, 'February', 62000.00); INSERT INTO monthly_sales VALUES (3, 'March', 31000.00); INSERT INTO monthly_sales VALUES (4, 'April', 75000.00);`
    },
    quiz: [
      {
        question: `What is the main difference between GROUP BY and window functions?`,
        options: [
          `GROUP BY collapses rows; window functions keep original rows`,
          `Window functions only work with text`,
          `GROUP BY is faster in every situation`,
          `Window functions cannot use ORDER BY`
        ],
        correctIndex: 0,
        explanation: `GROUP BY aggregates rows into fewer output rows. Window functions calculate values across rows while preserving the original row count. Window functions can absolutely use ORDER BY inside OVER.`
      },
      {
        question: `What does PARTITION BY do inside OVER?`,
        options: [
          `It splits the window into independent groups`,
          `It deletes duplicate rows`,
          `It creates a permanent table`,
          `It converts text into numbers`
        ],
        correctIndex: 0,
        explanation: `PARTITION BY defines separate windows for each group, such as each store or category. It does not delete rows, create tables, or convert types.`
      },
      {
        question: `Why can you usually not filter directly on a window function in WHERE?`,
        options: [
          `Window functions are evaluated after WHERE in logical query order`,
          `Window functions are encrypted`,
          `WHERE only accepts text values`,
          `Window functions cannot appear in SELECT`
        ],
        correctIndex: 0,
        explanation: `WHERE filters rows before window calculations are computed. To filter by a window result, wrap the query in a CTE or subquery and filter outside.`
      },
      {
        question: `If two rows tie and you use RANK(), what happens to the next rank?`,
        options: [
          `It skips a number`,
          `It repeats the same number forever`,
          `It becomes NULL`,
          `It becomes zero`
        ],
        correctIndex: 0,
        explanation: `RANK gives tied rows the same rank and then skips the next rank value. DENSE_RANK would not skip. ROW_NUMBER would assign unique sequential numbers if ordering is unique.`
      }
    ],
    milestones: [
      `Understand how window functions differ from GROUP BY.`,
      `Use ROW_NUMBER, RANK, and DENSE_RANK.`,
      `Define windows using OVER, PARTITION BY, and ORDER BY.`,
      `Filter window results safely using CTEs or subqueries.`
    ]
  },
  {
    id: `sql-10`,
    order: 10,
    module: `PostgreSQL & Advanced Analytics`,
    icon: `⚡`,
    title: `Query Optimization & EXPLAIN`,
    philosophy: `A query that feels fast on ten rows can collapse under ten million rows. Backend engineers cannot treat the database as magic. You must understand whether the engine is scanning the whole table, using an index, joining efficiently, or drowning in unnecessary rows. EXPLAIN is your window into the database's decision-making process.`,
    concepts: [
      {
        title: `1. Execution Plans and EXPLAIN`,
        beginner: `EXPLAIN asks the database to show its plan before running the query for real. It reveals whether the database will scan the whole table, use an index, or join tables in a certain order.`,
        advanced: `EXPLAIN exposes the cost-based optimizer's chosen plan tree. It shows scan types, join strategies, estimated row counts, and cost estimates. Reading plans is the fastest way to diagnose why a query is slow.`
      },
      {
        title: `2. Sequential Scans versus Index Scans`,
        beginner: `A sequential scan reads every row from start to finish. That is slow for large tables. An index scan uses a sorted structure to jump near the matching rows, which is much faster for selective queries.`,
        advanced: `Sequential scans are O(N) and may be acceptable for small tables or broad reads. Index scans use B-Tree traversal, often O(log N), but still require heap access unless the index covers all selected columns.`
      },
      {
        title: `3. Indexes Speed Reads but Slow Writes`,
        beginner: `An index is like a book's index. It makes finding data faster. But every time you insert, update, or delete rows, the database may also need to update the index. Too many indexes can slow writes.`,
        advanced: `Indexes improve read selectivity but introduce write amplification. Each additional index increases insertion, update, and maintenance cost. Production indexing should be driven by real query patterns, not guesswork.`
      },
      {
        title: `4. Statistics and Cost-Based Optimization`,
        beginner: `The database keeps summaries about your data, such as how many rows exist and how common certain values are. It uses these summaries to guess which plan will be fastest.`,
        advanced: `Cost-based planners depend on table and index statistics. Stale statistics can produce bad estimates, causing wrong join orders or scan choices. Analyzing tables keeps optimizer decisions aligned with actual data distribution.`
      }
    ],
    practical: {
      title: `Explaining a Log Search`,
      intro: `We have seeded a logs table with id, timestamp, and level. An index exists on level. Your task is to inspect the execution plan for a query that finds all ERROR logs.`,
      steps: [
        `Start with EXPLAIN QUERY PLAN.`,
        `Write the query: SELECT * FROM logs WHERE level = 'ERROR'.`,
        `End with a semicolon.`,
        `Run the command. You should see the database explain how it plans to execute the query, including whether it uses the index.`
      ],
      goal: `Use EXPLAIN to inspect how the database executes a filtered log search.`,
      starterQuery: `EXPLAIN QUERY PLAN `,
      solutionQuery: `EXPLAIN QUERY PLAN SELECT * FROM logs WHERE level = 'ERROR';`,
      seedSql: `CREATE TABLE logs (id INTEGER PRIMARY KEY, timestamp TEXT, level TEXT); CREATE INDEX idx_logs_level ON logs(level); INSERT INTO logs VALUES (1, '2026-07-15 12:00:00', 'INFO'); INSERT INTO logs VALUES (2, '2026-07-15 12:05:00', 'ERROR'); INSERT INTO logs VALUES (3, '2026-07-15 12:10:00', 'WARN');`
    },
    quiz: [
      {
        question: `What does EXPLAIN show?`,
        options: [
          `The database's chosen execution plan`,
          `The user passwords`,
          `The frontend bundle size`,
          `The network cable status`
        ],
        correctIndex: 0,
        explanation: `EXPLAIN reveals the plan the optimizer intends to use, including scans, joins, and estimated costs. It does not expose passwords, frontend assets, or hardware cables.`
      },
      {
        question: `Why is an index scan often faster than a sequential scan?`,
        options: [
          `It can jump toward matching rows instead of reading every row`,
          `It deletes unmatched rows permanently`,
          `It compresses the table`,
          `It disables transactions`
        ],
        correctIndex: 0,
        explanation: `Indexes allow targeted access to matching rows, often through logarithmic tree traversal. They do not delete rows, compress tables, or disable transactional behavior.`
      },
      {
        question: `What is a downside of adding too many indexes?`,
        options: [
          `Writes become slower because indexes must also be maintained`,
          `The database forgets table schemas`,
          `SELECT queries become illegal`,
          `NULL values disappear`
        ],
        correctIndex: 0,
        explanation: `Every index adds maintenance cost during INSERT, UPDATE, and DELETE. Too many indexes can hurt write throughput. They do not erase schemas, block SELECT, or remove NULLs.`
      },
      {
        question: `Why are database statistics important?`,
        options: [
          `They help the optimizer estimate row counts and choose better plans`,
          `They automatically encrypt data`,
          `They replace primary keys`,
          `They convert SQL into JavaScript`
        ],
        correctIndex: 0,
        explanation: `Statistics inform the cost-based planner about data distribution. Better estimates lead to better plan choices. Statistics do not encrypt data or replace schema objects.`
      }
    ],
    milestones: [
      `Read execution plans with EXPLAIN.`,
      `Understand sequential scans versus index scans.`,
      `Balance read performance against write cost.`,
      `Recognize the role of statistics in query planning.`
    ]
  },
  {
    id: `sql-11`,
    order: 11,
    module: `Advanced PostgreSQL & Backend Architecture`,
    icon: `🏦`,
    title: `ACID Transactions`,
    philosophy: `Some operations must happen as one complete unit. Moving money, creating an order and its line items, or deducting inventory must not partially succeed. If the server crashes halfway through, users must not see broken state. Transactions provide the guarantee: either everything commits, or nothing does.`,
    concepts: [
      {
        title: `1. BEGIN and COMMIT`,
        beginner: `BEGIN starts a transaction. Inside it, you can run several SQL commands. COMMIT saves all of them together. If anything fails before COMMIT, the changes can be undone.`,
        advanced: `BEGIN opens a transactional scope. COMMIT makes changes durable by finalizing WAL records and releasing transactional state. This enforces atomicity and durability within ACID semantics.`
      },
      {
        title: `2. ROLLBACK`,
        beginner: `If something goes wrong inside a transaction, ROLLBACK cancels all the changes made since BEGIN. The database returns to the state it was in before the transaction started.`,
        advanced: `ROLLBACK aborts the transaction and discards uncommitted mutations. Backend frameworks often issue rollback automatically when exceptions occur inside database transaction blocks.`
      },
      {
        title: `3. Concurrency, Locks, and Deadlocks`,
        beginner: `When two users try to change the same row at the same time, the database makes them take turns. If two transactions block each other forever, the database detects a deadlock and cancels one of them.`,
        advanced: `Concurrency control uses locking and MVCC to preserve consistency. Deadlock detection resolves circular lock waits by aborting a victim transaction. Applications must be prepared to retry safely.`
      },
      {
        title: `4. Idempotency and Retries`,
        beginner: `Network problems can cause an app to retry a request. If a payment request is retried, you must not charge the customer twice. Idempotency keys and unique constraints help make retries safe.`,
        advanced: `Transactions alone do not prevent duplicate client submissions. Idempotency keys, unique constraints, and conditional writes make retried operations safe. This is essential for payments, webhooks, and background jobs.`
      }
    ],
    practical: {
      title: `A Safe Bank Transfer`,
      intro: `We have seeded an accounts table. Alice has 500 and Bob has 100. Your task is to transfer 100 from Alice to Bob inside one transaction.`,
      steps: [
        `Start with BEGIN TRANSACTION.`,
        `Write an UPDATE that subtracts 100 from Alice's balance.`,
        `Write a second UPDATE that adds 100 to Bob's balance.`,
        `End with COMMIT.`,
        `Run the block. If you select from accounts afterward, Alice should have 400 and Bob should have 200.`
      ],
      goal: `Execute a two-step balance transfer atomically using BEGIN and COMMIT.`,
      starterQuery: `BEGIN TRANSACTION;
-- Update Alice here

-- Update Bob here

COMMIT;`,
      solutionQuery: `BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
      seedSql: `CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT, balance INTEGER); INSERT INTO accounts VALUES (1, 'Alice', 500); INSERT INTO accounts VALUES (2, 'Bob', 100);`
    },
    quiz: [
      {
        question: `What is the main purpose of a transaction?`,
        options: [
          `To make multiple database changes succeed together or fail together`,
          `To compress old rows`,
          `To rename tables automatically`,
          `To create frontend components`
        ],
        correctIndex: 0,
        explanation: `Transactions provide atomicity. A group of changes commits together or rolls back together. They are not for compression, renaming, or frontend rendering.`
      },
      {
        question: `What does ROLLBACK do?`,
        options: [
          `It cancels uncommitted changes and restores the previous state`,
          `It permanently saves changes`,
          `It deletes the database`,
          `It converts TEXT to INTEGER`
        ],
        correctIndex: 0,
        explanation: `ROLLBACK aborts the transaction and undoes uncommitted mutations. COMMIT saves changes. ROLLBACK does not delete the database or change column types.`
      },
      {
        question: `What is a dirty read?`,
        options: [
          `Reading data that has not been committed yet`,
          `Reading from a backup file`,
          `Reading a table with no indexes`,
          `Reading JSON columns`
        ],
        correctIndex: 0,
        explanation: `A dirty read occurs when one transaction reads uncommitted changes from another transaction. If the other transaction rolls back, the read data was never truly valid.`
      },
      {
        question: `Why are idempotency keys important in backend transactions?`,
        options: [
          `They prevent retried requests from creating duplicate effects`,
          `They make SQL queries shorter`,
          `They remove the need for indexes`,
          `They automatically encrypt payloads`
        ],
        correctIndex: 0,
        explanation: `Idempotency keys let servers safely retry operations without duplicating side effects, such as charging a card twice. They do not replace indexes, encryption, or query optimization.`
      }
    ],
    milestones: [
      `Use BEGIN and COMMIT to group changes atomically.`,
      `Use ROLLBACK to abort failed operations.`,
      `Understand concurrency, locks, and deadlocks.`,
      `Design retry-safe operations with idempotency.`
    ]
  },
  {
    id: `sql-12`,
    order: 12,
    module: `Advanced PostgreSQL & Backend Architecture`,
    icon: `📦`,
    title: `JSON Data in SQL`,
    philosophy: `Relational databases are famous for strict structure, but real applications often need flexibility: user settings, feature flags, webhook payloads, and metadata with unpredictable keys. Modern SQL databases solve this by supporting JSON columns. The professional skill is knowing when JSON is useful and when it becomes a trap that hides queryable facts inside unstructured text.`,
    concepts: [
      {
        title: `1. JSON Columns for Flexible Data`,
        beginner: `Sometimes you do not know every field in advance. Instead of creating fifty columns for user settings, you can store one JSON object like theme, alerts, and language in a single column.`,
        advanced: `JSON columns store semi-structured data inside relational tables. PostgreSQL's JSONB stores parsed binary JSON, enabling efficient querying and indexing. SQLite commonly stores JSON as TEXT and provides JSON functions.`
      },
      {
        title: `2. Extracting JSON Values`,
        beginner: `You can pull a single value out of JSON. For example, you can ask for the theme value inside a settings column. In SQLite, json_extract(settings, '$.theme') reaches into the JSON and returns that field.`,
        advanced: `JSON path extraction lets SQL query nested document fields. PostgreSQL uses operators such as -> and ->>, while SQLite uses json_extract. Extracted values can be projected, filtered, or indexed.`
      },
      {
        title: `3. When Not to Use JSON`,
        beginner: `If you often filter, sort, or join by a field, that field usually deserves its own real column. JSON is convenient, but hiding important data inside JSON can make queries slower and harder to validate.`,
        advanced: `Frequently queried attributes should usually be relational columns with proper types, constraints, and indexes. JSON is best for optional metadata, variable payloads, and shape-changing data, not for core business entities that require integrity enforcement.`
      },
      {
        title: `4. Indexing JSON`,
        beginner: `Searching inside JSON can be slow if the database must inspect every row. Databases can speed this up by indexing specific JSON values, just like normal columns.`,
        advanced: `PostgreSQL can index JSON paths with expression indexes or GIN indexes on JSONB. This enables fast containment and path lookups. Without indexing, JSON predicates may force broad scans.`
      }
    ],
    practical: {
      title: `Extracting User Settings`,
      intro: `We have seeded a users table with id and settings. The settings column contains JSON strings. Your task is to find the id of the user whose theme is dark.`,
      steps: [
        `Select id from users.`,
        `Add a WHERE clause.`,
        `Use json_extract(settings, '$.theme') to read the theme key.`,
        `Compare it to 'dark'.`,
        `Run the query. You should see user id 2 returned.`
      ],
      goal: `Filter rows based on a value inside a JSON column.`,
      starterQuery: `-- Write your SQL query here
SELECT id FROM users WHERE `,
      solutionQuery: `SELECT id FROM users WHERE json_extract(settings, '$.theme') = 'dark';`,
      seedSql: `CREATE TABLE users (id INTEGER PRIMARY KEY, settings TEXT); INSERT INTO users VALUES (1, '{"theme": "light", "alerts": false}'); INSERT INTO users VALUES (2, '{"theme": "dark", "alerts": true}'); INSERT INTO users VALUES (3, '{"theme": "system", "alerts": true}');`
    },
    quiz: [
      {
        question: `Why are JSON columns useful in relational databases?`,
        options: [
          `They allow flexible, semi-structured data alongside structured relational data`,
          `They automatically replace primary keys`,
          `They remove the need for transactions`,
          `They make every query faster`
        ],
        correctIndex: 0,
        explanation: `JSON columns provide flexibility for variable-shape data while keeping the rest of the schema relational. They do not replace keys, remove transactional requirements, or guarantee faster queries.`
      },
      {
        question: `What does json_extract(settings, '$.theme') do?`,
        options: [
          `It returns the value of the theme key inside the settings JSON`,
          `It deletes the settings column`,
          `It creates a new table`,
          `It converts JSON into an image`
        ],
        correctIndex: 0,
        explanation: `json_extract reads a JSON path and returns the value at that path. It does not modify schema, create tables, or convert data into images.`
      },
      {
        question: `When should a field usually be a real column instead of JSON?`,
        options: [
          `When it is frequently filtered, joined, indexed, or constrained`,
          `When it contains curly braces`,
          `When the frontend uses JavaScript`,
          `When the table has more than ten rows`
        ],
        correctIndex: 0,
        explanation: `Core queryable fields benefit from real columns because they can use types, constraints, indexes, and joins efficiently. The presence of JSON syntax or frontend language does not decide this.`
      },
      {
        question: `What is the benefit of indexing a JSON path in databases like PostgreSQL?`,
        options: [
          `It speeds up searches for specific JSON keys or values`,
          `It permanently converts JSON to relational tables`,
          `It disables NULL values`,
          `It removes the need for WHERE clauses`
        ],
        correctIndex: 0,
        explanation: `Indexing JSON paths allows the engine to locate matching documents faster. It does not transform JSON into tables, remove NULLs, or eliminate filtering logic.`
      }
    ],
    milestones: [
      `Store flexible semi-structured data using JSON columns.`,
      `Extract nested JSON values with SQL functions.`,
      `Recognize when JSON is appropriate and when a column is better.`,
      `Understand JSON indexing for high-performance querying.`
    ]
  },

  {
    id: `sql-13`,
    order: 13,
    module: `Advanced PostgreSQL & Backend Architecture`,
    icon: `🔮`,
    title: `Virtual Tables (Views)`,
    philosophy: `As backend systems grow, queries become too complex to repeat everywhere. A report might join five tables, filter by role, aggregate revenue, and rename columns for the API. If every route repeats that logic, the codebase becomes fragile. Views solve this by saving a query as a reusable database object. They create abstraction, simplify access, and can hide sensitive data. But professional engineers must also understand what views do not do: a normal view is not a magic cache.`,
    concepts: [
      {
        title: `1. Standard Views`,
        beginner: `A view is like a saved query. Instead of writing the same complicated SELECT again and again, you save it with CREATE VIEW. After that, you can query the view like it is a table.`,
        advanced: `A standard view stores a query definition, not physical data. When the view is queried, the engine executes the underlying query. Views provide a stable interface over complex schemas and can be versioned like an API contract.`
      },
      {
        title: `2. Materialized Views`,
        beginner: `A normal view recalculates every time you ask for it. A materialized view saves the result to disk so it can be read very fast. The tradeoff is that it must be refreshed when the original data changes.`,
        advanced: `Materialized views persist query results physically. They are useful for dashboards, analytics, and expensive aggregations. The engineering cost is refresh strategy: scheduled jobs, incremental refreshes, or cache invalidation logic.`
      },
      {
        title: `3. Views as Security Boundaries`,
        beginner: `Views can hide secret columns. If an employees table has salary data, you can create a public view that only shows name and department. Apps can read the view without ever seeing the salary column.`,
        advanced: `Views support least-privilege access. By granting SELECT on a view instead of the base table, sensitive columns and rows can be excluded from unauthorized roles. This pushes security down to the database layer instead of relying only on API code.`
      },
      {
        title: `4. View Performance and Update Limits`,
        beginner: `A view does not automatically make queries faster. If the saved query is slow, selecting from the view is still slow. Also, views with joins or aggregates often cannot be updated directly.`,
        advanced: `Standard views are usually inlined and optimized with the outer query, but complex views may prevent certain optimizations or direct writes. Updatable views are limited by SQL rules. Complex writes may require INSTEAD OF triggers or application logic.`
      }
    ],
    practical: {
      title: `Abstracting Complex Data`,
      intro: `We have seeded an employees table with id, name, and department. Your task is to create a view named dev_team that selects all employees whose department is Engineering.`,
      steps: [
        `Start with CREATE VIEW dev_team AS.`,
        `Write the query: SELECT * FROM employees.`,
        `Add WHERE department = 'Engineering'.`,
        `End with a semicolon.`,
        `Run the statement. You should see the view created successfully. Querying it should return Alice and Charlie.`
      ],
      goal: `Create a reusable view that filters employees by department.`,
      starterQuery: `CREATE VIEW dev_team AS
`,
      solutionQuery: `CREATE VIEW dev_team AS
SELECT * FROM employees WHERE department = 'Engineering';`,
      seedSql: `CREATE TABLE employees (id INTEGER, name TEXT, department TEXT); INSERT INTO employees VALUES (1, 'Alice', 'Engineering'); INSERT INTO employees VALUES (2, 'Bob', 'HR'); INSERT INTO employees VALUES (3, 'Charlie', 'Engineering');`
    },
    quiz: [
      {
        question: `What is the main difference between a standard view and a materialized view?`,
        options: [
          `Standard views store text only; materialized views store numbers only`,
          `Standard views run their query live; materialized views store a physical result that must be refreshed`,
          `Standard views are temporary; materialized views are deleted after one query`,
          `There is no difference`
        ],
        correctIndex: 1,
        explanation: `Standard views are saved queries that execute when used. Materialized views store the query result physically for faster reads, but require refresh logic when underlying data changes.`
      },
      {
        question: `How can views improve database security?`,
        options: [
          `They automatically encrypt the whole database`,
          `They expose safe columns while hiding sensitive columns from unauthorized users`,
          `They prevent users from logging in`,
          `They delete old rows automatically`
        ],
        correctIndex: 1,
        explanation: `Views can project only approved columns and rows. Granting access to the view instead of the base table helps enforce least privilege. They do not encrypt the whole database or manage login sessions.`
      },
      {
        question: `Does a standard view store query results on disk?`,
        options: [
          `Yes, always`,
          `No, it stores the query definition and executes it when queried`,
          `Only if the table has more than 100 rows`,
          `Only when using ORDER BY`
        ],
        correctIndex: 1,
        explanation: `A standard view is virtual. It does not persist result data by itself. Materialized views are the pattern that stores results physically.`
      },
      {
        question: `Why might a view with JOINs and aggregates not be directly updatable?`,
        options: [
          `Because the database cannot decide which base table should receive the write`,
          `Because JOINs are illegal in views`,
          `Because all views are read-only forever`,
          `Because aggregates delete rows`
        ],
        correctIndex: 0,
        explanation: `When a view combines multiple tables or aggregate results, a direct UPDATE or INSERT may not map cleanly to one underlying table. Databases restrict such writes unless special rules or triggers handle them.`
      }
    ],
    milestones: [
      `Create views to encapsulate complex queries.`,
      `Understand live views versus materialized snapshots.`,
      `Use views to hide sensitive data.`,
      `Recognize that views are abstractions, not automatic performance caches.`
    ]
  },
  {
    id: `sql-14`,
    order: 14,
    module: `Advanced PostgreSQL & Backend Architecture`,
    icon: `🤖`,
    title: `Database Triggers`,
    philosophy: `Some logic must happen automatically whenever data changes. If an account is deleted, the audit log must record it. If an email changes, the old email should be preserved. Triggers move this automation into the database itself, guaranteeing the rule runs even if an application route forgets. But triggers are powerful, and power requires discipline: hidden automation can become hidden complexity.`,
    concepts: [
      {
        title: `1. What Is a Trigger?`,
        beginner: `A trigger is a robot inside the database. You tell it: when INSERT, UPDATE, or DELETE happens on this table, automatically run this SQL. It is useful for logging, validation, and automatic defaults.`,
        advanced: `Triggers execute procedural logic in response to DML events. They run inside the same transaction as the triggering statement. This gives strong consistency guarantees but adds execution cost and side effects that must be carefully documented.`
      },
      {
        title: `2. OLD and NEW Row Context`,
        beginner: `Inside a trigger, you can compare the old data and the new data. OLD.email is what the email used to be. NEW.email is what it is becoming. This is perfect for audit logs.`,
        advanced: `OLD and NEW are contextual row references. INSERT triggers see NEW. DELETE triggers see OLD. UPDATE triggers see both. This allows triggers to validate transitions, copy history, or reject invalid state changes.`
      },
      {
        title: `3. BEFORE Triggers for Prevention`,
        beginner: `A BEFORE trigger runs before the row is saved. It can inspect the data and stop the write if something is wrong. This is like a security guard checking data before it enters the database.`,
        advanced: `BEFORE triggers can mutate incoming values or raise exceptions to abort the operation. They are useful for normalization, default enrichment, and enforcing rules that standard constraints cannot express cleanly.`
      },
      {
        title: `4. Trigger Costs and Hidden Side Effects`,
        beginner: `Triggers are automatic, which is helpful, but too many triggers can slow down writes and make behavior hard to understand. If a developer does not know a trigger exists, the database can seem to do mysterious things.`,
        advanced: `Triggers add overhead to every write and can cascade through multiple tables. Production systems should reserve triggers for cross-cutting data guarantees, not business orchestration that belongs in observable application services.`
      }
    ],
    practical: {
      title: `Automating an Audit Log`,
      intro: `We have seeded an accounts table and an audit_logs table. Your task is to create a trigger named log_deletion. Whenever an account is deleted, the trigger should insert the deleted account id into audit_logs.`,
      steps: [
        `Start with CREATE TRIGGER log_deletion AFTER DELETE ON accounts.`,
        `Add BEGIN to open the trigger body.`,
        `Write INSERT INTO audit_logs (account_id) VALUES (OLD.id).`,
        `Close the trigger with END;.`,
        `Run the trigger creation. You should see it created successfully. If you later delete an account, the audit table will receive the deleted id.`
      ],
      goal: `Create an automatic audit trigger for deleted accounts.`,
      starterQuery: `CREATE TRIGGER log_deletion AFTER DELETE ON accounts
BEGIN
  -- Write your INSERT automation here
  
END;`,
      solutionQuery: `CREATE TRIGGER log_deletion AFTER DELETE ON accounts
BEGIN
  INSERT INTO audit_logs (account_id) VALUES (OLD.id);
END;`,
      seedSql: `CREATE TABLE accounts (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE audit_logs (log_id INTEGER PRIMARY KEY, account_id INTEGER, action_date DATETIME DEFAULT CURRENT_TIMESTAMP); INSERT INTO accounts VALUES (99, 'System Admin');`
    },
    quiz: [
      {
        question: `What do OLD and NEW represent inside a trigger?`,
        options: [
          `The database version before and after an update`,
          `The row values before and after a data change`,
          `The oldest and newest tables in the database`,
          `The first and last user accounts`
        ],
        correctIndex: 1,
        explanation: `OLD and NEW provide access to row state during trigger execution. OLD is the previous state, while NEW is the incoming state. They are not database versions or table references.`
      },
      {
        question: `What usually happens if a trigger fails during the same transaction as the main write?`,
        options: [
          `The main write still succeeds`,
          `The whole transaction can be aborted and rolled back`,
          `The database deletes the table`,
          `The trigger becomes a view`
        ],
        correctIndex: 1,
        explanation: `Triggers run inside the transaction that caused them. If the trigger raises an error, the database can abort the whole operation, preventing partial or inconsistent writes.`
      },
      {
        question: `What is a good use for a BEFORE trigger?`,
        options: [
          `Rejecting invalid data before it is written`,
          `Rendering frontend components`,
          `Replacing primary keys automatically`,
          `Disabling backups`
        ],
        correctIndex: 0,
        explanation: `BEFORE triggers can validate or transform incoming data before it reaches storage. They are not for frontend rendering, removing primary key semantics, or disabling backups.`
      },
      {
        question: `What is a major risk of using too many triggers?`,
        options: [
          `They can create hidden side effects and slow down writes`,
          `They automatically corrupt JSON`,
          `They make SELECT illegal`,
          `They remove the need for indexes`
        ],
        correctIndex: 0,
        explanation: `Triggers automate behavior, but hidden automation can surprise developers and increase write cost. They do not corrupt JSON by default, block SELECT, or replace indexes.`
      }
    ],
    milestones: [
      `Understand event-driven automation inside the database.`,
      `Use OLD and NEW to inspect row transitions.`,
      `Use BEFORE triggers to prevent invalid writes.`,
      `Balance trigger power against observability and write performance.`
    ]
  },
  {
    id: `sql-15`,
    order: 15,
    module: `Advanced PostgreSQL & Backend Architecture`,
    icon: `🔐`,
    title: `Multi-Tenant & Security`,
    philosophy: `Modern SaaS applications serve many customers from one shared backend. Shopify stores thousands of stores. Slack hosts thousands of workspaces. In the database, this creates a dangerous question: how do we guarantee that one tenant never sees another tenant's data? Application filters help, but professional systems push isolation as close to the data as possible. Security should fail closed, not open.`,
    concepts: [
      {
        title: `1. Shared-Schema Multi-Tenancy`,
        beginner: `Multi-tenancy means many customers share the same database. Each row gets a tenant_id so the system knows which company owns it. This is efficient, but every query must respect the tenant boundary.`,
        advanced: `Shared-schema multi-tenancy scales better than one database per customer, but it turns tenant isolation into a system-wide invariant. The tenant context must be propagated from authentication through every data access path.`
      },
      {
        title: `2. Row-Level Security`,
        beginner: `Instead of trusting every query to remember WHERE tenant_id = 1, the database can enforce the rule automatically. If a user belongs to tenant 1, the database simply hides rows from other tenants.`,
        advanced: `Row-Level Security uses database policies to filter rows based on session context. Even if an application query omits an explicit tenant predicate, the policy can still prevent cross-tenant reads. This makes isolation a database-level guarantee.`
      },
      {
        title: `3. Roles and Least Privilege`,
        beginner: `Your app should not use one all-powerful database user. The public API should get a limited role that can only read and write what it needs. Admin jobs can get stronger roles. This limits damage if credentials leak.`,
        advanced: `GRANT and REVOKE define fine-grained permissions. Combined with RLS, roles implement zero-trust data access. The database becomes an enforcement layer independent of application bugs or compromised services.`
      },
      {
        title: `4. Tenant Context and Negative Testing`,
        beginner: `Security tests should not only check what a user can see. They should also check what the user cannot see. If the tenant ID is missing, the system should return nothing, not everything.`,
        advanced: `Production multi-tenant systems test missing context, wrong context, role escalation, and cross-tenant access. Fail-closed behavior is essential. If absent tenant context defaults to open access, the architecture is unsafe.`
      }
    ],
    practical: {
      title: `Simulating Tenant Isolation`,
      intro: `SQLite does not have full PostgreSQL Row-Level Security, but we can simulate tenant isolation with a view. We have seeded an orders table with tenant_id values. Your task is to create a view named my_store_orders that only shows orders belonging to tenant 1.`,
      steps: [
        `Start with CREATE VIEW my_store_orders AS.`,
        `Write SELECT * FROM orders.`,
        `Add WHERE tenant_id = 1.`,
        `End with a semicolon.`,
        `Run the statement. If you query the view, you should see only Coffee Beans and Paper Cups, not the tenant 2 orders.`
      ],
      goal: `Create a view that isolates one tenant's data from a shared table.`,
      starterQuery: `CREATE VIEW my_store_orders AS
`,
      solutionQuery: `CREATE VIEW my_store_orders AS
SELECT * FROM orders WHERE tenant_id = 1;`,
      seedSql: `CREATE TABLE orders (id INTEGER PRIMARY KEY, item TEXT, tenant_id INTEGER); INSERT INTO orders VALUES (101, 'Coffee Beans', 1); INSERT INTO orders VALUES (102, 'Espresso Machine', 2); INSERT INTO orders VALUES (103, 'Paper Cups', 1); INSERT INTO orders VALUES (104, 'Industrial Grinder', 2);`
    },
    quiz: [
      {
        question: `What is the biggest risk of shared-schema multi-tenancy without strong isolation?`,
        options: [
          `The database becomes too small`,
          `One tenant could accidentally read another tenant's data`,
          `SQL queries become shorter`,
          `Indexes stop working`
        ],
        correctIndex: 1,
        explanation: `The core risk is cross-tenant data leakage. If application code forgets tenant filtering, users may see data they should never access. This is not related to database size or index failure.`
      },
      {
        question: `How does Row-Level Security reduce tenant data leaks?`,
        options: [
          `It applies security policies inside the database engine itself`,
          `It encrypts the frontend bundle`,
          `It deletes all unused tables`,
          `It converts SQL into NoSQL`
        ],
        correctIndex: 0,
        explanation: `RLS enforces row filters at the database level based on session context. This protects data even if application code makes a mistake. It does not encrypt frontends or convert database models.`
      },
      {
        question: `What should happen if tenant context is missing from a request?`,
        options: [
          `Return all rows so the user is not blocked`,
          `Fail closed and return no data or raise an error`,
          `Automatically choose the first tenant`,
          `Restart the server`
        ],
        correctIndex: 1,
        explanation: `Missing tenant context must fail safely. Returning all rows or guessing a tenant creates serious security holes. Secure systems deny access when identity context is absent.`
      },
      {
        question: `Why should multi-tenant systems include negative security tests?`,
        options: [
          `To prove that unauthorized tenants cannot access protected rows`,
          `To make tests run slower`,
          `To remove the need for authentication`,
          `To disable logging`
        ],
        correctIndex: 0,
        explanation: `Negative tests verify rejection paths, not just happy paths. Security is proven by showing what cannot be accessed. They do not remove authentication or logging requirements.`
      }
    ],
    milestones: [
      `Understand shared-schema multi-tenant architecture.`,
      `Use tenant_id boundaries to isolate customer data.`,
      `Understand Row-Level Security as a database-level fail-safe.`,
      `Design fail-closed behavior and negative security tests.`
    ]
  },
  {
    id: `sql-16`,
    order: 16,
    module: `Database Administration & Scaling`,
    icon: `🧹`,
    title: `MVCC & Database Maintenance (VACUUM)`,
    philosophy: `A database that serves thousands of users cannot freeze the world every time someone updates a row. PostgreSQL solves this with MVCC: readers see a consistent snapshot while writers create new row versions. This brilliance comes with a cost. Old row versions become dead tuples. If nobody cleans them, the database grows bloated, slow, and eventually unstable. Maintenance is not optional in production systems.`,
    concepts: [
      {
        title: `1. MVCC and Row Versions`,
        beginner: `When you update a row, the database often does not erase the old row immediately. It creates a new version and keeps the old version around for readers that still need it. This lets people read and write at the same time without constant locking.`,
        advanced: `MVCC provides snapshot isolation by maintaining multiple tuple versions. Each transaction sees data according to its snapshot. UPDATE creates a new tuple version while the old version remains visible to older transactions until no longer needed.`
      },
      {
        title: `2. Dead Tuples and Bloat`,
        beginner: `Old row versions that nobody needs anymore are called dead tuples. They still take up space. Over time, the table becomes bloated, like a warehouse full of empty boxes. Queries slow down because the database must walk through more junk.`,
        advanced: `Dead tuples consume heap space and can degrade index efficiency. Bloat increases I/O, buffer cache pressure, and query latency. Monitoring dead tuple counts and table size is essential for write-heavy systems.`
      },
      {
        title: `3. VACUUM and Autovacuum`,
        beginner: `VACUUM is the database cleanup command. It finds dead rows and marks their space as reusable. In real systems, an automatic background process usually handles this, but engineers still need to understand it.`,
        advanced: `VACUUM reclaims space for future writes by updating visibility maps and free space maps. Autovacuum runs automatically based on thresholds. High-write tables often need aggressive per-table autovacuum tuning.`
      },
      {
        title: `4. VACUUM versus VACUUM FULL`,
        beginner: `Normal VACUUM cleans without stopping the world. VACUUM FULL rewrites the entire table to shrink the file, but it can lock the table and block traffic. Use FULL carefully.`,
        advanced: `Standard VACUUM is non-blocking but does not always shrink the OS file. VACUUM FULL rewrites the relation and reclaims physical space, but requires exclusive access and can cause downtime. It is an emergency tool, not routine maintenance.`
      }
    ],
    practical: {
      title: `Reclaiming Disk Space`,
      intro: `We have seeded a sessions table and deleted some rows to simulate dead tuples. Your task is to run the maintenance command that cleans up reusable space.`,
      steps: [
        `In the query editor, write the single command: VACUUM.`,
        `End with a semicolon.`,
        `Run the command. You should see successful execution with no error message.`,
        `Understand that in production PostgreSQL, autovacuum usually performs this work automatically.`
      ],
      goal: `Execute VACUUM to clean dead tuples and maintain database health.`,
      starterQuery: `-- Write your maintenance command here
`,
      solutionQuery: `VACUUM;`,
      seedSql: `CREATE TABLE sessions (id INTEGER PRIMARY KEY, user_id INTEGER, token TEXT); INSERT INTO sessions VALUES (1, 101, 'abc'); INSERT INTO sessions VALUES (2, 102, 'def'); INSERT INTO sessions VALUES (3, 103, 'ghi'); DELETE FROM sessions WHERE id IN (1, 2);`
    },
    quiz: [
      {
        question: `Why does PostgreSQL keep dead tuples after UPDATE or DELETE?`,
        options: [
          `Because storage is free`,
          `To support MVCC snapshots for active transactions`,
          `Because DELETE is not real`,
          `To speed up frontend rendering`
        ],
        correctIndex: 1,
        explanation: `MVCC requires old row versions so concurrent transactions can still see consistent snapshots. Dead tuples are not kept for frontend performance, and DELETE is real but version cleanup is delayed.`
      },
      {
        question: `What does standard VACUUM mainly do?`,
        options: [
          `Deletes the database schema`,
          `Reclaims space from dead tuples for future use`,
          `Converts SQL into JSON`,
          `Disables transactions`
        ],
        correctIndex: 1,
        explanation: `VACUUM cleans dead tuple visibility and makes space reusable. It does not delete schemas, transform SQL into JSON, or disable ACID transactions.`
      },
      {
        question: `What is autovacuum?`,
        options: [
          `A background process that automatically cleans and maintains tables`,
          `A tool that deletes tables nightly`,
          `A frontend cache cleaner`,
          `A password rotation system`
        ],
        correctIndex: 0,
        explanation: `Autovacuum automatically performs maintenance based on table activity. It prevents bloat from accumulating. It does not delete schemas or manage frontend caches.`
      },
      {
        question: `What is a common sign of table bloat?`,
        options: [
          `Table size grows while row count stays stable and performance degrades`,
          `The database becomes too small`,
          `All queries return zero rows`,
          `Indexes disappear automatically`
        ],
        correctIndex: 0,
        explanation: `Bloat often appears as increasing storage usage and slower scans without a matching increase in live rows. It does not make queries return zero rows or delete indexes by itself.`
      }
    ],
    milestones: [
      `Understand how MVCC enables concurrent reads and writes.`,
      `Recognize dead tuples as the source of database bloat.`,
      `Use VACUUM and understand autovacuum's role.`,
      `Know when VACUUM FULL is appropriate and dangerous.`
    ]
  },
  {
    id: `sql-17`,
    order: 17,
    module: `Database Administration & Scaling`,
    icon: `🗄️`,
    title: `Table Partitioning`,
    philosophy: `At massive scale, one giant table becomes a liability. Indexes grow too large. Deletes take hours. Maintenance windows become impossible. Partitioning solves this by splitting one logical table into many smaller physical pieces. The application still sees one table, but the database can route queries, archive old data, and scan only relevant partitions. The golden rule: partitioning must match how queries actually filter data.`,
    concepts: [
      {
        title: `1. Logical Parent, Physical Children`,
        beginner: `A partitioned table looks like one table to your app, but underneath it is divided into pieces. For example, a logs table can have one partition for January and another for February.`,
        advanced: `Declarative partitioning defines a parent relation with no data and child partitions that store rows. The planner routes inserts to the correct partition based on partition bounds and query predicates.`
      },
      {
        title: `2. Range, List, and Hash Partitioning`,
        beginner: `Range partitioning splits data by a range, often dates. List partitioning splits by exact values, like region. Hash partitioning spreads rows evenly across buckets.`,
        advanced: `Range partitioning is ideal for time-series retention. List partitioning fits categorical tenancy or regional data. Hash partitioning balances load when no natural range or list dominates access patterns.`
      },
      {
        title: `3. Partition Pruning`,
        beginner: `If you ask for logs from March, the database can ignore all other months. This is called partition pruning. It is like searching only the correct drawer instead of the whole filing cabinet.`,
        advanced: `Partition pruning occurs when the planner proves certain partitions cannot contain matching rows. Queries must include the partition key in WHERE clauses for pruning to work effectively.`
      },
      {
        title: `4. Archival and Maintenance`,
        beginner: `Deleting millions of old rows can be slow. With partitions, you can remove an entire old partition almost instantly. This makes data retention much easier.`,
        advanced: `Dropping or detaching a partition is a metadata-level operation compared to massive DELETE writes. It avoids WAL amplification, vacuum overhead, and long locks. Automated partition creation and drop policies are essential for time-series systems.`
      }
    ],
    practical: {
      title: `Simulating Partition Routing`,
      intro: `SQLite does not provide PostgreSQL declarative partitioning, but we can simulate a unified logical table. We have seeded two physical tables: logs_2025 and logs_2026. Your task is to create a view named all_logs that combines both tables using UNION ALL.`,
      steps: [
        `Start with CREATE VIEW all_logs AS.`,
        `Write SELECT * FROM logs_2025.`,
        `Add UNION ALL.`,
        `Write SELECT * FROM logs_2026.`,
        `End with a semicolon.`,
        `Run the statement. Querying all_logs should show both System started and User login.`
      ],
      goal: `Create a unified view that simulates a partitioned logical table.`,
      starterQuery: `CREATE VIEW all_logs AS
`,
      solutionQuery: `CREATE VIEW all_logs AS
SELECT * FROM logs_2025
UNION ALL
SELECT * FROM logs_2026;`,
      seedSql: `CREATE TABLE logs_2025 (id INTEGER PRIMARY KEY, msg TEXT, year INTEGER DEFAULT 2025); CREATE TABLE logs_2026 (id INTEGER PRIMARY KEY, msg TEXT, year INTEGER DEFAULT 2026); INSERT INTO logs_2025 VALUES (1, 'System started', 2025); INSERT INTO logs_2026 VALUES (2, 'User login', 2026);`
    },
    quiz: [
      {
        question: `Why is dropping a partition often better than deleting millions of rows?`,
        options: [
          `It can be much faster and avoids heavy write overhead`,
          `It automatically encrypts the remaining data`,
          `It converts the table into JSON`,
          `It removes the need for indexes`
        ],
        correctIndex: 0,
        explanation: `Dropping a partition removes a physical segment quickly, while DELETE must process each row and generate write overhead. It does not encrypt data, convert tables, or remove indexing needs.`
      },
      {
        question: `What is partition pruning?`,
        options: [
          `The database skips partitions that cannot contain matching rows`,
          `The database deletes duplicate rows automatically`,
          `The database compresses old partitions`,
          `The database converts partitions into views`
        ],
        correctIndex: 0,
        explanation: `Pruning allows the planner to ignore irrelevant partitions based on query filters. It does not delete duplicates, compress data, or transform partitions into views.`
      },
      {
        question: `Why must queries usually filter by the partition key?`,
        options: [
          `So the database can prune irrelevant partitions`,
          `So the database can rename the table`,
          `So NULL values disappear`,
          `So the frontend can cache data`
        ],
        correctIndex: 0,
        explanation: `If the query does not reference the partition key, the planner may need to scan all partitions. Filtering by the partition key enables pruning and improves performance.`
      },
      {
        question: `Which partition strategy is most natural for timestamp-based logs?`,
        options: [
          `Range partitioning by time`,
          `Hash partitioning by password`,
          `List partitioning by file extension`,
          `No partitioning`
        ],
        correctIndex: 0,
        explanation: `Time-series data is commonly partitioned by date or month ranges. This supports pruning and retention policies. Hashing passwords or listing file extensions does not match typical log access patterns.`
      }
    ],
    milestones: [
      `Understand why monolithic tables struggle at large scale.`,
      `Compare range, list, and hash partitioning.`,
      `Use partition pruning to reduce scan volume.`,
      `Archive old data efficiently by dropping partitions.`
    ]
  },
  {
    id: `sql-18`,
    order: 18,
    module: `Database Administration & Scaling`,
    icon: `🧭`,
    title: `Advanced Indexing (BRIN, GiST, pgvector)`,
    philosophy: `Indexes are not one-size-fits-all. A B-Tree is excellent for exact matches, ranges, and sorting, but it is the wrong tool for geographic proximity, full-text search, or AI similarity search. Expert backend engineers choose index structures based on the shape of the data and the query pattern. The wrong index wastes memory. The right index makes impossible queries practical.`,
    concepts: [
      {
        title: `1. B-Tree Strengths and Write Cost`,
        beginner: `A normal index is like a book's index. It helps the database jump to the right place instead of reading every page. But every index also slows down writes a little because it must be updated too.`,
        advanced: `B-Tree indexes support equality, range, and ordered scans. They are the default index type in many databases. However, each index increases write amplification and maintenance cost, so indexes should be designed from real query patterns.`
      },
      {
        title: `2. BRIN for Massive Ordered Data`,
        beginner: `If you have billions of log rows sorted by time, a normal index can become huge. A BRIN index is smaller. It remembers rough ranges for blocks of data, like saying rows 1 to 1000 are from January.`,
        advanced: `BRIN indexes store summary information for physical block ranges. They work best when data is naturally correlated with physical order, such as append-only timestamp logs. They sacrifice precision for a tiny footprint.`
      },
      {
        title: `3. GiST for Spatial and Complex Data`,
        beginner: `Maps cannot be searched like alphabetized names. To find nearby drivers or overlapping regions, databases use spatial indexes. GiST helps organize shapes, boxes, and locations.`,
        advanced: `GiST supports geometric and range-based data types. With extensions like PostGIS, it powers proximity queries, bounding-box overlap, and polygon intersection. It is essential for location-based backends.`
      },
      {
        title: `4. Inverted Indexes and Approximate Search`,
        beginner: `Full-text search needs a word map: for each word, store where it appears. That is an inverted index. AI similarity search uses a different trick: vector indexes find nearby points in high-dimensional space.`,
        advanced: `Full-text engines use inverted indexes for term lookup and ranking. Vector extensions use ANN indexes such as HNSW to approximate nearest neighbors. These structures trade exactness for massive speed in search and AI workloads.`
      }
    ],
    practical: {
      title: `Full-Text Search Indexing`,
      intro: `We have seeded an SQLite FTS5 virtual table named documents. It uses an inverted index for full-text search. Your task is to find the title of the document containing the word database.`,
      steps: [
        `Select the title column from documents.`,
        `Use WHERE to filter the documents table.`,
        `Use the MATCH operator instead of LIKE.`,
        `Write documents MATCH 'database'.`,
        `Run the query. You should see SQL Guide returned.`
      ],
      goal: `Query a full-text index using MATCH instead of slow substring search.`,
      starterQuery: `-- Write your query here using the MATCH operator
SELECT title FROM documents WHERE `,
      solutionQuery: `SELECT title FROM documents WHERE documents MATCH 'database';`,
      seedSql: `CREATE VIRTUAL TABLE documents USING fts5(title, content); INSERT INTO documents VALUES ('SQL Guide', 'A database is a fortress of integrity.'); INSERT INTO documents VALUES ('CSS Tips', 'Learn to style web pages beautifully.'); INSERT INTO documents VALUES ('Nodejs Intro', 'Build backend servers easily.');`
    },
    quiz: [
      {
        question: `When is a BRIN index often a better choice than a normal B-Tree index?`,
        options: [
          `For massive append-only tables where data is naturally ordered by time`,
          `For tiny tables with five rows`,
          `For password encryption`,
          `For frontend routing`
        ],
        correctIndex: 0,
        explanation: `BRIN shines on huge, naturally ordered datasets like logs or time-series tables. It keeps index size small. It is not for encryption or frontend routing, and tiny tables rarely need specialized indexes.`
      },
      {
        question: `What kind of queries does GiST help with?`,
        options: [
          `Spatial, geometric, and range-overlap queries`,
          `Only alphabetical sorting`,
          `Only integer addition`,
          `Only JSON pretty printing`
        ],
        correctIndex: 0,
        explanation: `GiST supports complex data shapes such as geometry and ranges. It is commonly used for geographic search and overlap checks. It is not limited to simple sorting or arithmetic.`
      },
      {
        question: `Why is MATCH better than LIKE for full-text search?`,
        options: [
          `It uses an inverted index built for word lookup`,
          `It deletes duplicate documents`,
          `It converts text into images`,
          `It automatically translates languages`
        ],
        correctIndex: 0,
        explanation: `MATCH queries full-text structures that map words to documents. LIKE with wildcards often scans text inefficiently. MATCH does not delete documents or translate content.`
      },
      {
        question: `What tradeoff do approximate vector indexes like HNSW make?`,
        options: [
          `They give very fast similarity search while accepting slight approximation`,
          `They guarantee perfect results but are always slow`,
          `They remove the need for embeddings`,
          `They only work with text files`
        ],
        correctIndex: 0,
        explanation: `ANN indexes such as HNSW prioritize speed for nearest-neighbor search. They may return approximate results instead of exact neighbors. They still require embeddings and work with vector data, not just raw text files.`
      }
    ],
    milestones: [
      `Match index types to query patterns.`,
      `Understand B-Tree write amplification.`,
      `Use BRIN for large time-series workloads.`,
      `Understand GiST, inverted indexes, and vector indexes for advanced search.`
    ]
  },

  {
    id: `sql-19`,
    order: 19,
    module: `Backend Data Architecture`,
    icon: `🧱`,
    title: `Normalization & Schema Design`,
    philosophy: `A database schema is not just storage; it is the blueprint that protects your application from duplicated, inconsistent, and contradictory data. Professional backend engineers do not merely write queries; they design relationships so that each fact lives in exactly one place. Normalization is the discipline of organizing columns and tables to reduce redundancy, prevent update anomalies, and make future changes safer.`,
    concepts: [
      {
        title: `1. Why Normalization Exists`,
        beginner: `Imagine storing a customer's address on every single order they ever placed. If that customer moves, you must update every order row. If you miss one, your data disagrees with itself. Normalization prevents this by storing the customer address once and referencing it from orders.`,
        advanced: `Normalization eliminates update, insert, and delete anomalies by decomposing relations into smaller tables with well-defined keys and dependencies. Instead of repeating mutable facts, the schema stores them once and uses foreign keys to reference them. This reduces write amplification and prevents inconsistent application state.`
      },
      {
        title: `2. First, Second, and Third Normal Form`,
        beginner: `First Normal Form means each column holds one value, not a list. Second Normal Form means every column depends on the whole primary key, not just part of it. Third Normal Form means non-key columns should not depend on other non-key columns.`,
        advanced: `1NF enforces atomicity of column values. 2NF removes partial dependencies on composite keys. 3NF removes transitive dependencies, meaning non-key attributes must depend only on the primary key. In production schema design, 3NF is often the baseline for transactional tables.`
      },
      {
        title: `3. Many-to-Many Relationships and Junction Tables`,
        beginner: `A student can take many courses, and a course can have many students. You cannot store that cleanly in one table. Instead, you create a linking table, often called a junction table, with one row for each enrollment.`,
        advanced: `A junction table resolves many-to-many relationships by storing pairs of foreign keys. It usually has a composite primary key, such as student_id and course_id, preventing duplicate relationships. Additional relationship metadata, like enrolled_at, can also be stored on the junction table.`
      },
      {
        title: `4. Controlled Denormalization`,
        beginner: `Sometimes, reading data is more important than perfectly avoiding duplication. For example, an analytics dashboard may need a summary table that is faster to read. That is called denormalization. The dangerous part is letting the duplicated data become stale.`,
        advanced: `Denormalization intentionally duplicates or precomputes data to improve read performance. It is acceptable when the write path maintains consistency through constraints, triggers, materialized views, or application-level synchronization. Without controlled refresh logic, denormalized tables become a source of silent data corruption.`
      }
    ],
    practical: {
      title: `Modeling Many-to-Many Enrollments`,
      intro: `We have seeded two tables: students and courses. Your task is to create a junction table named student_courses that links students to courses. The table must prevent duplicate enrollments for the same student and course pair.`,
      steps: [
        `Start with: CREATE TABLE student_courses (.`,
        `Add a column named student_id with type INTEGER and NOT NULL.`,
        `Add a column named course_id with type INTEGER and NOT NULL.`,
        `Add foreign key references to students(id) and courses(id).`,
        `Add a composite primary key using both student_id and course_id.`,
        `Close the statement with ); and run it. You should see a new table created with no error output.`
      ],
      goal: `Create a junction table that safely models a many-to-many relationship between students and courses.`,
      starterQuery: `CREATE TABLE student_courses (\n  -- Define columns and constraints here\n`,
      solutionQuery: `CREATE TABLE student_courses (\n  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,\n  course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,\n  PRIMARY KEY (student_id, course_id)\n);`,
      seedSql: `CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT NOT NULL); CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT NOT NULL); INSERT INTO students VALUES (1, 'Alice'); INSERT INTO students VALUES (2, 'Bob'); INSERT INTO courses VALUES (10, 'SQL Foundations'); INSERT INTO courses VALUES (20, 'Backend Architecture');`
    },
    quiz: [
      {
        question: `What problem does normalization primarily solve?`,
        options: [
          `It reduces redundant data and prevents inconsistent updates`,
          `It encrypts sensitive database columns`,
          `It automatically creates indexes for every column`,
          `It compresses disk storage to save cloud costs`
        ],
        correctIndex: 0,
        explanation: `Normalization stores each fact in the appropriate place so updates happen once instead of in many duplicated rows. Encryption is a security concern, indexes are performance structures, and compression is storage optimization; none of those are the primary purpose of normalization.`
      },
      {
        question: `Which structure best models a many-to-many relationship between students and courses?`,
        options: [
          `Add a course_id column directly to the students table`,
          `Add a student_id column directly to the courses table`,
          `Create a junction table containing student_id and course_id`,
          `Merge students and courses into one wide table`
        ],
        correctIndex: 2,
        explanation: `A junction table stores each relationship pair as its own row. Putting one foreign key inside the other table only models one-to-many relationships, and merging tables creates duplication and update anomalies.`
      },
      {
        question: `Which situation violates Third Normal Form?`,
        options: [
          `A column contains only one value per row`,
          `A non-key column depends on another non-key column`,
          `Every row has a unique primary key`,
          `A foreign key references a parent table`
        ],
        correctIndex: 1,
        explanation: `Third Normal Form requires non-key columns to depend directly on the primary key, not on other non-key columns. Unique keys, atomic values, and foreign keys are normal relational features and do not violate 3NF by themselves.`
      },
      {
        question: `When is denormalization acceptable in professional systems?`,
        options: [
          `Whenever developers want to avoid writing JOINs`,
          `When read performance is critical and consistency is maintained by controlled refresh or write logic`,
          `When the database has too many tables`,
          `When the frontend application needs direct database access`
        ],
        correctIndex: 1,
        explanation: `Denormalization is a deliberate performance trade-off. It is acceptable when reads dominate and the system has reliable logic to keep duplicated data consistent. Avoiding JOINs alone is not a safe reason if it creates silent inconsistency.`
      }
    ],
    milestones: [
      `Understand why normalization prevents duplicated and contradictory data.`,
      `Recognize the practical meaning of 1NF, 2NF, and 3NF.`,
      `Model many-to-many relationships using junction tables.`,
      `Apply denormalization only with controlled consistency mechanisms.`
    ]
  },
  {
    id: `sql-20`,
    order: 20,
    module: `Advanced Query Patterns`,
    icon: `🧩`,
    title: `Advanced JOINs & Set Operations`,
    philosophy: `Basic JOINs connect two different tables, but professional SQL often requires more powerful patterns: joining a table to itself, combining result sets, finding differences between datasets, and generating controlled combinations. Mastering these patterns turns SQL from a simple lookup tool into a full relational reasoning engine.`,
    concepts: [
      {
        title: `1. Self Joins`,
        beginner: `Sometimes one table contains a relationship to itself. For example, an employees table can have a manager_id column that points to another employee. To show each employee with their manager, you join the employees table to itself using two different table aliases.`,
        advanced: `A self join treats the same table as two logical relations by assigning aliases. The join condition usually compares a child row's foreign key to the parent row's primary key. Self joins are common for adjacency-list hierarchies, such as employees, categories, or threaded comments.`
      },
      {
        title: `2. CROSS JOIN`,
        beginner: `A CROSS JOIN combines every row from the first table with every row from the second table. If you have 3 sizes and 4 colors, a CROSS JOIN gives you 12 combinations. It is useful, but dangerous if the tables are large.`,
        advanced: `CROSS JOIN produces the Cartesian product of two relations. It is useful for generating test matrices, calendar grids, or combinatorial option sets. However, without careful filtering, result size grows multiplicatively and can overwhelm memory and network resources.`
      },
      {
        title: `3. UNION and UNION ALL`,
        beginner: `UNION stacks the results of two queries on top of each other. UNION removes duplicate rows, while UNION ALL keeps every row. If you do not need duplicates removed, UNION ALL is usually faster.`,
        advanced: `UNION performs set union and eliminates duplicates, which often requires sorting or hashing. UNION ALL simply appends result sets and avoids duplicate elimination. Both queries must produce compatible column counts and types.`
      },
      {
        title: `4. INTERSECT and EXCEPT`,
        beginner: `INTERSECT returns only rows that appear in both queries. EXCEPT returns rows from the first query that do not appear in the second query. Think of INTERSECT as “what they share” and EXCEPT as “what is only in the first list.”`,
        advanced: `INTERSECT computes the relational intersection, while EXCEPT computes the relational difference. These operators are useful for reconciliation, diffing datasets, and identifying missing records. NULL values are treated as equal for set-operation comparison purposes in standard SQL set semantics.`
      }
    ],
    practical: {
      title: `Displaying Employees and Their Managers`,
      intro: `We have seeded an employees table where each employee may have a manager_id pointing to another employee. Your task is to write a self join that shows each employee's name next to their manager's name. If an employee has no manager, display No Manager.`,
      steps: [
        `Select e.name and alias it as employee.`,
        `Use COALESCE(m.name, 'No Manager') and alias it as manager.`,
        `Start from employees e.`,
        `LEFT JOIN employees m using the condition e.manager_id = m.id.`,
        `Run the query. You should see every employee listed, including the top-level person with No Manager.`
      ],
      goal: `Use a self join to reconstruct an organizational hierarchy from a single employees table.`,
      starterQuery: `-- Write your self join here\nSELECT `,
      solutionQuery: `SELECT e.name AS employee, COALESCE(m.name, 'No Manager') AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;`,
      seedSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, manager_id INTEGER); INSERT INTO employees VALUES (1, 'Diana', NULL); INSERT INTO employees VALUES (2, 'Bob', 1); INSERT INTO employees VALUES (3, 'Grace', 2); INSERT INTO employees VALUES (4, 'Evan', 3);`
    },
    quiz: [
      {
        question: `Why are aliases required when joining a table to itself?`,
        options: [
          `They let the database treat the same table as two separate logical sources`,
          `They encrypt the table name from external users`,
          `They automatically improve JOIN performance`,
          `They convert NULL values into empty strings`
        ],
        correctIndex: 0,
        explanation: `A self join needs two distinct relation names so columns can be qualified as child columns and parent columns. Aliases do not encrypt data, do not automatically improve performance, and do not change NULL behavior.`
      },
      {
        question: `What is the main difference between UNION and UNION ALL?`,
        options: [
          `UNION works only with numbers; UNION ALL works only with text`,
          `UNION removes duplicate rows; UNION ALL keeps all rows including duplicates`,
          `UNION ALL sorts results automatically; UNION does not`,
          `UNION ALL requires matching table names; UNION does not`
        ],
        correctIndex: 1,
        explanation: `UNION performs duplicate elimination, while UNION ALL simply concatenates compatible result sets. Sorting is controlled by ORDER BY, and neither operator requires the underlying table names to match.`
      },
      {
        question: `What result does a CROSS JOIN produce?`,
        options: [
          `Only matching rows based on a shared key`,
          `All rows from the left table and NULLs from the right table`,
          `Every possible combination of rows from both tables`,
          `A temporary view stored permanently on disk`
        ],
        correctIndex: 2,
        explanation: `CROSS JOIN returns the Cartesian product: each row from the first table paired with every row from the second table. It does not require a matching condition and does not create a permanent view.`
      },
      {
        question: `What does EXCEPT return in SQL?`,
        options: [
          `Rows that appear in both queries`,
          `Rows from the first query that do not appear in the second query`,
          `Rows from the second query that do not appear in the first query`,
          `All rows from both queries with duplicates removed`
        ],
        correctIndex: 1,
        explanation: `EXCEPT returns the difference from the first result set minus the second result set. INTERSECT returns shared rows, and UNION combines result sets rather than subtracting them.`
      }
    ],
    milestones: [
      `Use self joins to model hierarchical relationships inside one table.`,
      `Understand when CROSS JOIN is useful and when it is dangerous.`,
      `Combine result sets using UNION and UNION ALL.`,
      `Compare datasets using INTERSECT and EXCEPT.`
    ]
  },
  {
    id: `sql-21`,
    order: 21,
    module: `Advanced Query Patterns`,
    icon: `🌳`,
    title: `Recursive CTEs & Hierarchical Data`,
    philosophy: `Many real-world datasets are trees: organizational charts, comment threads, file systems, product categories, and dependency graphs. Ordinary JOINs cannot walk an unknown number of levels. Recursive Common Table Expressions give SQL the ability to repeat a query step until the entire branch or tree has been traversed.`,
    concepts: [
      {
        title: `1. The Anchor and Recursive Members`,
        beginner: `A recursive CTE has two parts. The first part chooses the starting row, like one employee. The second part repeatedly finds the next related row, like that employee's manager, until there are no more rows to find.`,
        advanced: `A recursive CTE consists of an anchor query and a recursive query combined with UNION or UNION ALL. The anchor seeds the working table. The recursive member joins the working table back to the base table, producing new rows until the recursive member returns an empty set.`
      },
      {
        title: `2. Traversing Hierarchies`,
        beginner: `If each employee has a manager_id, you can start with one employee and keep joining to the manager until you reach the top boss. This lets you display the full management chain for any person.`,
        advanced: `Recursive CTEs are commonly used with adjacency-list models, where each row contains a parent reference. The recursive query joins child rows to parent rows and can accumulate depth, paths, or totals as it walks the hierarchy.`
      },
      {
        title: `3. Building Paths and Depth`,
        beginner: `While walking up a tree, you can carry extra information. For example, you can build a text path like “Evan > Grace > Bob > Diana” or count how many levels you climbed.`,
        advanced: `Recursive CTEs can project accumulated state columns, such as path strings, depth counters, or running sums. This avoids client-side traversal and keeps graph-walking logic declarative inside the database engine.`
      },
      {
        title: `4. Safety: Termination, Limits, and Cycles`,
        beginner: `If data contains a loop, like Alice manages Bob and Bob manages Alice, a recursive query could run forever. Real systems prevent this by limiting depth or detecting rows that have already been visited.`,
        advanced: `Recursive CTEs must terminate. In production, engineers add depth limits, use UNION to suppress duplicates, or maintain visited-path logic to prevent cycles. Indexes on parent foreign keys reduce recursive lookup cost.`
      }
    ],
    practical: {
      title: `Walking Up an Organizational Chart`,
      intro: `We have seeded an employees table with manager_id values. Your task is to use a recursive CTE to start with employee id 4 and walk upward through managers until reaching the employee with no manager. The final output should be the full management chain path.`,
      steps: [
        `Use WITH RECURSIVE to create a CTE named chain.`,
        `Make the anchor query select the employee where id = 4.`,
        `Include a path column that starts with the employee name.`,
        `In the recursive member, join employees to chain using employees.id = chain.manager_id.`,
        `Append each manager name to the path.`,
        `Select the final path where manager_id IS NULL. You should see a path from Evan up to Diana.`
      ],
      goal: `Use a recursive CTE to traverse an employee hierarchy from a child employee up to the top-level manager.`,
      starterQuery: `WITH RECURSIVE chain(id, name, manager_id, path) AS (\n  -- Anchor and recursive members here\n)\nSELECT path FROM chain WHERE manager_id IS NULL;`,
      solutionQuery: `WITH RECURSIVE chain(id, name, manager_id, path) AS (\n  SELECT id, name, manager_id, name\n  FROM employees\n  WHERE id = 4\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, c.path || ' > ' || e.name\n  FROM employees e\n  JOIN chain c ON e.id = c.manager_id\n)\nSELECT path FROM chain WHERE manager_id IS NULL;`,
      seedSql: `CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT NOT NULL, manager_id INTEGER); INSERT INTO employees VALUES (1, 'Diana', NULL); INSERT INTO employees VALUES (2, 'Bob', 1); INSERT INTO employees VALUES (3, 'Grace', 2); INSERT INTO employees VALUES (4, 'Evan', 3);`
    },
    quiz: [
      {
        question: `What are the two main parts of a recursive CTE?`,
        options: [
          `A CREATE part and a DROP part`,
          `An anchor query and a recursive query`,
          `A WHERE part and a HAVING part`,
          `A primary key and a foreign key`
        ],
        correctIndex: 1,
        explanation: `Recursive CTEs need an anchor to define the starting rows and a recursive member that repeatedly joins back to the working result. CREATE/DROP, WHERE/HAVING, and keys are unrelated to the structural definition of recursion.`
      },
      {
        question: `What naturally stops a recursive CTE from continuing forever?`,
        options: [
          `The database automatically stops after one row`,
          `The recursive member returns no new rows`,
          `The COMMIT command closes the recursion`,
          `The ORDER BY clause finalizes the loop`
        ],
        correctIndex: 1,
        explanation: `Recursion stops when the recursive query produces an empty result set. COMMIT, ORDER BY, and row limits do not define recursive termination by themselves.`
      },
      {
        question: `Why should the parent column, such as manager_id, usually be indexed?`,
        options: [
          `It encrypts hierarchical data`,
          `It helps the database quickly locate parent rows during recursive joins`,
          `It automatically removes duplicate employees`,
          `It converts text paths into integers`
        ],
        correctIndex: 1,
        explanation: `Recursive joins repeatedly look up parent rows. An index on the parent foreign key allows the engine to find parents quickly instead of scanning the whole table on each recursive step.`
      },
      {
        question: `What risk is introduced if hierarchical data contains a cycle?`,
        options: [
          `The recursive query may loop excessively or infinitely unless protected`,
          `The table automatically deletes itself`,
          `The database converts the cycle into NULL values`,
          `The primary key becomes duplicated automatically`
        ],
        correctIndex: 0,
        explanation: `A cycle means the recursive member can keep finding related rows forever. Engineers guard against this with depth limits, cycle detection, or duplicate suppression. Cycles do not delete tables or automatically duplicate primary keys.`
      }
    ],
    milestones: [
      `Understand the anchor and recursive members of a recursive CTE.`,
      `Traverse adjacency-list hierarchies using SQL.`,
      `Accumulate paths or depth while walking recursive data.`,
      `Protect recursive queries from infinite loops and poor performance.`
    ]
  },
  {
    id: `sql-22`,
    order: 22,
    module: `Data Integrity & Constraints`,
    icon: `🔒`,
    title: `CHECK, Foreign Keys & Safe Deletes`,
    philosophy: `A professional database does not merely store data; it refuses bad data. Constraints are the database's immune system. They stop invalid values, protect relationships between tables, and define what should happen when parent records are deleted. When integrity is enforced at the database layer, the entire backend becomes safer.`,
    concepts: [
      {
        title: `1. CHECK Constraints`,
        beginner: `A CHECK constraint is like a bouncer. It checks a rule before allowing a row to be saved. For example, an order total should never be negative, so you can require total >= 0.`,
        advanced: `A CHECK constraint defines a boolean predicate that must evaluate to true or unknown for every row. If the predicate fails, the write is rejected. CHECK constraints are ideal for domain-level validation such as non-negative amounts, valid ranges, and allowed states.`
      },
      {
        title: `2. Foreign Key Referential Actions`,
        beginner: `When a parent row is deleted, the database must know what to do with related child rows. For example, if a customer is deleted, should their orders be deleted too, blocked, or set to anonymous? Foreign key actions define this behavior.`,
        advanced: `Foreign keys can define referential actions such as CASCADE, SET NULL, RESTRICT, and NO ACTION. CASCADE deletes child rows automatically. SET NULL clears the foreign key. RESTRICT prevents deletion if children exist. Choosing the correct action is a critical data-modeling decision.`
      },
      {
        title: `3. Table-Level Constraints`,
        beginner: `Some rules involve more than one column. For example, a reservation might need to be unique for a room and a date together. Instead of putting the rule on one column, you define it at the table level.`,
        advanced: `Table-level constraints can reference multiple columns and are declared after column definitions. Composite primary keys, composite unique constraints, and multi-column CHECK constraints allow the schema to express complex business rules directly.`
      },
      {
        title: `4. Integrity Failures Are Safety Features`,
        beginner: `If the database rejects your INSERT or UPDATE, that is usually good. It means the database stopped bad data from entering. Backend code should handle these errors cleanly instead of bypassing the rules.`,
        advanced: `Constraint violations are transactional guardrails. In strict systems, a failed constraint aborts the statement or transaction, preventing partial corruption. Backend APIs should catch integrity errors and translate them into meaningful validation responses.`
      }
    ],
    practical: {
      title: `Creating an Order Table with Protective Constraints`,
      intro: `We have seeded a customers table. Your task is to create an orders table with three rules: every order must reference a customer, deleting a customer should cascade to their orders, and the order total must never be negative.`,
      steps: [
        `Start with: CREATE TABLE orders (.`,
        `Define id INTEGER PRIMARY KEY.`,
        `Define customer_id INTEGER NOT NULL and reference customers(id).`,
        `Add ON DELETE CASCADE to the customer_id foreign key.`,
        `Define total REAL with CHECK (total >= 0).`,
        `Close with ); and run the statement. You should see the table created successfully.`
      ],
      goal: `Create a constrained orders table that enforces referential integrity and prevents negative totals.`,
      starterQuery: `CREATE TABLE orders (\n  -- Define columns and constraints here\n`,
      solutionQuery: `CREATE TABLE orders (\n  id INTEGER PRIMARY KEY,\n  customer_id INTEGER NOT NULL REFERENCES customers(id) ON DELETE CASCADE,\n  total REAL CHECK (total >= 0)\n);`,
      seedSql: `CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT NOT NULL); INSERT INTO customers VALUES (1, 'Alice'); INSERT INTO customers VALUES (2, 'Bob');`
    },
    quiz: [
      {
        question: `What does a CHECK constraint do?`,
        options: [
          `It validates rows against a rule before allowing the write`,
          `It automatically creates an index on the column`,
          `It converts NULL values into default values`,
          `It grants read access to external applications`
        ],
        correctIndex: 0,
        explanation: `CHECK constraints enforce a boolean rule on row values. They are not indexes, they do not transform NULLs, and they do not manage permissions.`
      },
      {
        question: `What happens when a parent row is deleted with ON DELETE CASCADE?`,
        options: [
          `Child rows are automatically deleted`,
          `Child rows are converted to empty strings`,
          `The deletion is blocked forever`,
          `The database creates a backup table automatically`
        ],
        correctIndex: 0,
        explanation: `CASCADE propagates deletion to dependent child rows. RESTRICT or NO ACTION would block the delete, while SET NULL would clear the foreign key instead of deleting children.`
      },
      {
        question: `Which referential action prevents deleting a parent row if child rows still reference it?`,
        options: [
          `CASCADE`,
          `RESTRICT`,
          `SET NULL`,
          `UNION`
        ],
        correctIndex: 1,
        explanation: `RESTRICT blocks deletion when related child rows exist. CASCADE deletes children, SET NULL clears the child reference, and UNION is a set operation unrelated to foreign keys.`
      },
      {
        question: `Where are multi-column constraints usually defined?`,
        options: [
          `At the table level, after the column definitions`,
          `Inside the frontend JavaScript only`,
          `Inside the database connection string`,
          `Only inside temporary views`
        ],
        correctIndex: 0,
        explanation: `Multi-column constraints, such as composite primary keys or multi-column checks, are declared at the table level. Frontend validation is helpful but cannot replace database-enforced integrity.`
      }
    ],
    milestones: [
      `Use CHECK constraints to enforce domain rules.`,
      `Understand foreign key actions such as CASCADE and RESTRICT.`,
      `Model safe deletion behavior between parent and child tables.`,
      `Treat constraint violations as protective failures, not annoyances.`
    ]
  },
  {
    id: `sql-23`,
    order: 23,
    module: `Auditing & Temporal Data`,
    icon: `🕰️`,
    title: `Temporal Data & Audit Trails`,
    philosophy: `In serious backend systems, knowing what changed is as important as knowing what is true. Users update profiles, orders change status, and administrators modify sensitive records. Audit trails and temporal patterns let engineers answer: who changed what, when did it change, and what was the previous value?`,
    concepts: [
      {
        title: `1. Timestamps and Default Values`,
        beginner: `Every important record should have timestamps. A created_at column records when the row was born. An updated_at column records when it last changed. Databases can fill these automatically.`,
        advanced: `Temporal columns should use consistent time representations, preferably UTC. DEFAULT CURRENT_TIMESTAMP or equivalent database functions reduce reliance on application code and make the storage layer self-documenting.`
      },
      {
        title: `2. Audit Tables`,
        beginner: `An audit table is like a diary for your database. Instead of changing the original record and forgetting the old value, the system writes a history row whenever something important changes.`,
        advanced: `Audit tables store historical state outside the live row. They are usually append-only and may record the entity id, old values, new values, actor identifier, and timestamp. Append-only design protects the audit trail from tampering.`
      },
      {
        title: `3. Trigger-Based Auditing`,
        beginner: `A trigger can watch for UPDATE or DELETE actions. When a row changes, the trigger automatically copies the old data into the audit table. This means developers do not have to remember to log every change manually.`,
        advanced: `Database triggers execute within the same transaction as the data modification. This guarantees that if the main write succeeds, the audit write succeeds too, and if the transaction fails, both are rolled back together.`
      },
      {
        title: `4. Valid Time Versus Transaction Time`,
        beginner: `There are two kinds of time. Transaction time is when the database recorded the change. Valid time is when the change was supposed to become true in the real world. For example, a subscription may be recorded today but start next month.`,
        advanced: `Transaction-time modeling records when facts were known to the database. Valid-time modeling records when facts are true in the business domain. Full bi-temporal systems track both, enabling historical queries such as “what did we believe on a given date?”`
      }
    ],
    practical: {
      title: `Automatically Logging Document Changes`,
      intro: `We have seeded a documents table and an empty documents_history table. Your task is to create a trigger named documents_update_history. Whenever a document is updated, the trigger should insert the old title and new title into documents_history.`,
      steps: [
        `Write: CREATE TRIGGER documents_update_history.`,
        `Specify: AFTER UPDATE ON documents.`,
        `Open the trigger body with BEGIN.`,
        `Insert into documents_history using OLD.id, OLD.title, and NEW.title.`,
        `Use CURRENT_TIMESTAMP for changed_at.`,
        `Close with END; and run the trigger. You should see the trigger created with no error.`
      ],
      goal: `Create an automated audit trigger that records document title changes into a history table.`,
      starterQuery: `CREATE TRIGGER documents_update_history AFTER UPDATE ON documents BEGIN\n  -- Insert audit row here\nEND;`,
      solutionQuery: `CREATE TRIGGER documents_update_history AFTER UPDATE ON documents BEGIN\n  INSERT INTO documents_history (doc_id, old_title, new_title, changed_at)\n  VALUES (OLD.id, OLD.title, NEW.title, CURRENT_TIMESTAMP);\nEND;`,
      seedSql: `CREATE TABLE documents (id INTEGER PRIMARY KEY, title TEXT NOT NULL, body TEXT); CREATE TABLE documents_history (id INTEGER PRIMARY KEY, doc_id INTEGER NOT NULL, old_title TEXT, new_title TEXT, changed_at DATETIME); INSERT INTO documents VALUES (1, 'Draft Policy', 'Initial content');`
    },
    quiz: [
      {
        question: `Why use an audit table instead of only updating the live row?`,
        options: [
          `It preserves historical values and changes over time`,
          `It automatically makes queries faster`,
          `It removes the need for primary keys`,
          `It converts relational data into JSON`
        ],
        correctIndex: 0,
        explanation: `Audit tables keep history that would otherwise be overwritten. They do not automatically improve query speed, replace primary keys, or transform data into JSON.`
      },
      {
        question: `What does CURRENT_TIMESTAMP usually provide?`,
        options: [
          `The database server's current date and time`,
          `A random identifier`,
          `The last backup time`,
          `The total row count of the table`
        ],
        correctIndex: 0,
        explanation: `CURRENT_TIMESTAMP provides the current date and time value from the database engine. It is commonly used for created_at and changed_at audit columns.`
      },
      {
        question: `Inside an UPDATE trigger, what does OLD represent?`,
        options: [
          `The row values before the update`,
          `The row values after the update`,
          `The database version number`,
          `The oldest row in the entire table`
        ],
        correctIndex: 0,
        explanation: `OLD provides access to the row's previous values during UPDATE or DELETE operations. NEW provides the incoming values during INSERT or UPDATE operations.`
      },
      {
        question: `Why should audit logs usually be append-only?`,
        options: [
          `So historical records cannot be silently rewritten or destroyed`,
          `So the database can delete old logs automatically`,
          `So the audit table can replace the main table`,
          `So the frontend can edit history freely`
        ],
        correctIndex: 0,
        explanation: `Append-only logs protect trustworthiness. If audit rows can be edited or deleted, the audit trail no longer proves what happened. Automatic deletion and frontend editing would weaken the audit guarantee.`
      }
    ],
    milestones: [
      `Use timestamps to record creation and modification time.`,
      `Design audit tables for historical tracking.`,
      `Use triggers to automatically capture changes.`,
      `Understand the difference between transaction time and valid time.`
    ]
  },
  {
    id: `sql-24`,
    order: 24,
    module: `Search & Information Retrieval`,
    icon: `🔎`,
    title: `Full-Text Search & Relevance Ranking`,
    philosophy: `Users expect search to feel instant and intelligent. Typing a word into a search box should return relevant documents, not force the database to read every paragraph in every row. Full-text search systems solve this by building specialized indexes around words, not just rows.`,
    concepts: [
      {
        title: `1. Why LIKE Is Not Enough`,
        beginner: `Using LIKE with wildcards is like searching a library by reading every page of every book. If the search word can appear anywhere, the database often has to check every row. That becomes very slow as data grows.`,
        advanced: `Predicates such as LIKE '%term%' are generally not index-friendly because the leading wildcard prevents normal B-Tree traversal. Full-text search requires tokenization, inverted indexes, and ranking rather than simple substring scans.`
      },
      {
        title: `2. Inverted Indexes`,
        beginner: `An inverted index is like a giant word map. For each word, it stores a list of documents or rows where that word appears. When you search for “database,” the engine jumps directly to the rows that contain that word.`,
        advanced: `An inverted index maps terms to postings lists containing document identifiers and positional information. This transforms text search from sequential scanning into targeted lookup, making large document collections practical to query.`
      },
      {
        title: `3. MATCH and Tokenized Search`,
        beginner: `Full-text tables often use a special MATCH operator. Instead of asking “does this text contain these letters?”, MATCH asks “does this document contain these words or phrases?” That is faster and more useful.`,
        advanced: `Full-text engines tokenize input into terms, normalize language variants, and support MATCH queries for words, phrases, prefixes, and boolean expressions. The query interface is higher-level than string comparison and aligned with user search intent.`
      },
      {
        title: `4. Relevance Ranking`,
        beginner: `Search results should show the best matches first. A relevance score estimates how useful each result is. Documents with the search word more often, or in important places, may rank higher.`,
        advanced: `Relevance functions such as bm25 estimate match quality using term frequency, inverse document frequency, and document length. Ranking turns full-text search from a filtering operation into a user-facing search experience.`
      }
    ],
    practical: {
      title: `Searching Articles with Full-Text Indexing`,
      intro: `We have seeded an FTS5 virtual table named articles with title and body columns. Your task is to find articles that match the word database and order them by relevance score.`,
      steps: [
        `Select title from the articles table.`,
        `Also select bm25(articles) and alias it as score.`,
        `Filter with WHERE articles MATCH 'database'.`,
        `Order the results by score.`,
        `Run the query. You should see the SQL Guide article returned because its content mentions database.`
      ],
      goal: `Use full-text MATCH and relevance ranking to search documents efficiently.`,
      starterQuery: `-- Write your full-text query here\nSELECT `,
      solutionQuery: `SELECT title, bm25(articles) AS score\nFROM articles\nWHERE articles MATCH 'database'\nORDER BY score;`,
      seedSql: `CREATE VIRTUAL TABLE articles USING fts5(title, body); INSERT INTO articles VALUES ('SQL Guide', 'A database is a fortress of integrity.'); INSERT INTO articles VALUES ('CSS Tips', 'Learn to style web pages beautifully.'); INSERT INTO articles VALUES ('Node Intro', 'Build backend servers easily.');`
    },
    quiz: [
      {
        question: `Why is LIKE '%word%' often slow on large text columns?`,
        options: [
          `The leading wildcard usually prevents efficient index use and forces broad scanning`,
          `It deletes rows while searching`,
          `It converts text into numbers automatically`,
          `It requires a full database restart`
        ],
        correctIndex: 0,
        explanation: `A leading wildcard makes it difficult for normal indexes to narrow the search, so the engine may scan many rows. It does not delete data, convert text to numbers, or restart the database.`
      },
      {
        question: `What does an inverted index store?`,
        options: [
          `A mapping from words to the documents or rows containing them`,
          `A backup copy of the entire database`,
          `Only numeric aggregates`,
          `Encrypted user passwords`
        ],
        correctIndex: 0,
        explanation: `Inverted indexes map terms to locations where those terms occur. This is the core structure behind efficient full-text search. They are not backups, numeric aggregates, or password stores.`
      },
      {
        question: `What is the purpose of the MATCH operator in full-text search?`,
        options: [
          `It queries tokenized text using word-level search semantics`,
          `It creates a new physical table`,
          `It renames columns dynamically`,
          `It converts NULL into empty strings`
        ],
        correctIndex: 0,
        explanation: `MATCH searches full-text structures using terms and phrases rather than raw substring comparison. It does not create tables, rename columns, or transform NULL values.`
      },
      {
        question: `What does a ranking function such as bm25 help with?`,
        options: [
          `Ordering search results by estimated relevance`,
          `Encrypting search logs`,
          `Assigning primary keys`,
          `Compressing old rows`
        ],
        correctIndex: 0,
        explanation: `bm25 estimates how relevant each document is for a query, allowing results to be ordered from most to least useful. It is not related to encryption, primary keys, or compression.`
      }
    ],
    milestones: [
      `Understand why substring search does not scale for text-heavy applications.`,
      `Learn how inverted indexes power full-text search.`,
      `Use MATCH to query tokenized document tables.`,
      `Rank results by relevance instead of returning arbitrary matches.`
    ]
  },
  {
    id: `sql-25`,
    order: 25,
    module: `Performance Engineering`,
    icon: `🧯`,
    title: `Query Anti-Patterns & Performance Refactoring`,
    philosophy: `Most database performance problems are not caused by the database being weak; they are caused by queries preventing the database from using its strengths. Professional engineers learn to recognize anti-patterns: queries that look innocent but destroy index usage, bloat payloads, or create thousands of unnecessary round trips.`,
    concepts: [
      {
        title: `1. Non-SARGable Predicates`,
        beginner: `If you wrap an indexed column inside a function, the database may not be able to use the index. For example, searching by YEAR(created_at) is like asking the library to find books by shaking every shelf. It is better to compare the column directly to a range.`,
        advanced: `A predicate is SARGable when the query engine can seek directly through an index. Applying functions or expressions to indexed columns, such as LOWER(email) or DATE(created_at), often prevents index seeks. Rewrite predicates as direct range or equality conditions.`
      },
      {
        title: `2. SELECT * Bloat`,
        beginner: `SELECT * grabs every column, even columns your app does not need. This wastes memory, network bandwidth, and sometimes prevents the database from using smaller covering indexes.`,
        advanced: `SELECT * increases payload size, couples application code to schema changes, and can defeat covering-index optimizations. Explicit column projection improves stability, network efficiency, and sometimes allows index-only scans.`
      },
      {
        title: `3. The N+1 Query Problem`,
        beginner: `The N+1 problem happens when your app asks for a list, then runs one extra query for each item. If you load 100 users and then run 100 separate queries for their orders, you created 101 queries when one or two could have worked.`,
        advanced: `N+1 access patterns occur when parent records are fetched first and related records are fetched individually in a loop. Backend engineers eliminate this with JOINs, batched IN queries, eager loading, or dataloader patterns.`
      },
      {
        title: `4. Keyset Pagination Over Deep OFFSET`,
        beginner: `OFFSET pagination is like skipping 100,000 people in a line by counting every single one before you. Keyset pagination is like using a bookmark: continue after the last id or timestamp you already saw.`,
        advanced: `Deep OFFSET forces the engine to generate and discard many rows. Keyset pagination uses a stable ordering column, such as id or created_at, with a WHERE clause like WHERE id > last_seen_id. This is more stable and dramatically faster for deep pages.`
      }
    ],
    practical: {
      title: `Refactoring a Timestamp Search`,
      intro: `We have seeded a logs table with an indexed timestamp column. A beginner might search using a function on the timestamp. Your task is to write an index-friendly range query that finds all logs from July 15, 2026.`,
      steps: [
        `Select id and level from logs.`,
        `Do not wrap timestamp in a function.`,
        `Use a range: timestamp >= '2026-07-15'.`,
        `Also require timestamp < '2026-07-16'.`,
        `Run the query. You should see the ERROR and WARN logs from that day returned.`
      ],
      goal: `Replace function-based filtering with an index-friendly timestamp range.`,
      starterQuery: `-- Refactor the filter into an index-friendly range\nSELECT id, level FROM logs WHERE `,
      solutionQuery: `SELECT id, level FROM logs\nWHERE timestamp >= '2026-07-15'\n  AND timestamp < '2026-07-16';`,
      seedSql: `CREATE TABLE logs (id INTEGER PRIMARY KEY, timestamp TEXT NOT NULL, level TEXT NOT NULL); CREATE INDEX idx_logs_timestamp ON logs(timestamp); INSERT INTO logs VALUES (1, '2026-07-15 09:00:00', 'INFO'); INSERT INTO logs VALUES (2, '2026-07-15 09:05:00', 'ERROR'); INSERT INTO logs VALUES (3, '2026-07-15 09:10:00', 'WARN'); INSERT INTO logs VALUES (4, '2026-07-16 08:00:00', 'INFO');`
    },
    quiz: [
      {
        question: `Why is WHERE YEAR(created_at) = 2026 usually a performance anti-pattern?`,
        options: [
          `It applies a function to the indexed column, which can prevent index seeks`,
          `It automatically deletes older rows`,
          `It forces the database to create a new table`,
          `It converts integers into text`
        ],
        correctIndex: 0,
        explanation: `Wrapping a column in a function often prevents the optimizer from using an index directly. A better pattern is a range condition such as created_at >= '2026-01-01' AND created_at < '2027-01-01'.`
      },
      {
        question: `Why is SELECT * often discouraged in production backend code?`,
        options: [
          `It can fetch unnecessary columns, increase payload size, and make code fragile`,
          `It always disables foreign keys`,
          `It prevents the use of transactions`,
          `It automatically locks the whole database`
        ],
        correctIndex: 0,
        explanation: `SELECT * returns more data than needed and couples code to every schema change. It does not disable foreign keys, prevent transactions, or lock the database by itself.`
      },
      {
        question: `What is the N+1 query problem?`,
        options: [
          `Fetching a list and then issuing a separate query for each item's related data`,
          `Running too many DELETE statements`,
          `Using more than one JOIN in a query`,
          `Creating too many indexes on one table`
        ],
        correctIndex: 0,
        explanation: `N+1 means one query fetches N parent records, then N additional queries fetch related records one by one. The fix is usually batching, JOINs, or eager loading.`
      },
      {
        question: `Why is keyset pagination preferred over deep OFFSET pagination?`,
        options: [
          `It continues from a known position and avoids scanning and discarding many rows`,
          `It automatically encrypts page tokens`,
          `It removes the need for ORDER BY`,
          `It stores pages in the browser cache`
        ],
        correctIndex: 0,
        explanation: `Keyset pagination uses a stable cursor, such as WHERE id > last_seen_id, avoiding the cost of generating and throwing away offset rows. It still requires ordering and does not encrypt tokens or remove the need for ORDER BY.`
      }
    ],
    milestones: [
      `Recognize queries that prevent index usage.`,
      `Avoid SELECT * and project only required columns.`,
      `Detect and fix N+1 query access patterns.`,
      `Prefer keyset pagination over expensive deep offsets.`
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
