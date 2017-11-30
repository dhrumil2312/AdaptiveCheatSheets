INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (26, 1, 566, 1, 1, 1, 23, 'QWE');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (27, 1, 567, 1, 1, 1, 23, 'SQL');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (31, 1, 564, 1, 1, 1, 23, 'SQL');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (25, 1, 565, 1, 0, 0, 51, 'QWE');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (28, 1, 568, 1, 0, 0, 51, 'LOOP;');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (29, 1, 2, 1, 0, 0, 51, 'CODE;');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (30, 1, 3, 1, 0, 0, 51, 'CODE;');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (32, 1, 532, 1, 1, 1, 10, 'LKNFV');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (33, 1, 532, 1, 1, 1, 10, 'IC');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (34, 1, 562, 1, 1, 1, 10, 'HTML');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (35, 1, 563, 1, 1, 1, 10, 'SQL');
INSERT INTO public.AdaptiveCheatSheet_useractivity (id, user_id, note_id, upvote, downvote, notes_shared, note_access, tags) VALUES (36, 1, 532, 1, 1, 1, 10, 'LOOP;');

create table example as select id, upvote old , row_number() over(order by 1) new from "AdaptiveCheatSheet_notes";

select * from "AdaptiveCheatSheet_notes";
update "AdaptiveCheatSheet_notes" a set downvote = id;

update "AdaptiveCheatSheet_notes" a set upvote = (select new from example b where  a.id = b.id) where exists (select 1 from example c where a.id = c.id)

update "AdaptiveCheatSheet_notes" set upvote =  row_number() over(order by 1);


update( select  upvote old , row_number() over(order by 1) new from "AdaptiveCheatSheet_notes") set old = new;

