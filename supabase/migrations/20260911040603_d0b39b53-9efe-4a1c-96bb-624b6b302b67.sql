CREATE POLICY "Authenticated users subscribe to app channels only"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  topic LIKE 'suggestions-feed-%'
  OR topic LIKE 'announcements-feed-%'
  OR topic LIKE 'realtime:public:suggestions%'
  OR topic LIKE 'realtime:public:announcements%'
);

CREATE POLICY "Authenticated users write to app channels only"
ON realtime.messages
FOR INSERT
TO authenticated
WITH CHECK (
  topic LIKE 'suggestions-feed-%'
  OR topic LIKE 'announcements-feed-%'
  OR topic LIKE 'realtime:public:suggestions%'
  OR topic LIKE 'realtime:public:announcements%'
);