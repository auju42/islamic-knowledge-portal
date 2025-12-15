import type { Category, Book, Item } from '../types';

export const SEED_CATEGORIES: Category[] = [
    {
        id: 'cat_1',
        title: 'Hadith Collections',
        titleAr: 'Ar-Rubu\' al-Khali',
        description: 'The six major collections of Hadith',
        icon: 'book-open',
        order: 1
    },
    {
        id: 'cat_2',
        title: 'Quranic Exegesis',
        titleAr: 'Tafsir',
        description: 'Explanations and commentary on the Quran',
        icon: 'scroll',
        order: 2
    }
];

export const SEED_BOOKS: Book[] = [
    {
        id: 'book_1',
        categoryId: 'cat_1',
        title: 'Sahih Al-Bukhari',
        titleAr: 'صحيح البخاري',
        abbreviation: 'Bukhari',
        description: 'One of the most authentic collections of the Sunnah',
        itemCount: 0, // Will be updated
        status: 'published'
    },
    {
        id: 'book_2',
        categoryId: 'cat_1',
        title: 'Sahih Muslim',
        titleAr: 'صحيح مسلم',
        abbreviation: 'Muslim',
        description: 'The second most authentic collection',
        itemCount: 0,
        status: 'published'
    }
];

export const SEED_ITEMS: Item[] = [
    {
        id: 'item_1',
        bookId: 'book_1',
        globalNumber: 1,
        bookNumber: 1,
        chapterNumber: 1,
        referenceDisplay: 'Bukhari 1',
        title: 'Actions are by Intentions',
        titleAr: 'الأعمال بالنيات',
        content: `**Narrated 'Umar bin Al-Khattab:**
    
The Prophet (ﷺ) said, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for."`,
        contentAr: `**حدثنا الحميدي عبد الله بن الزبير، قال حدثنا سفيان، قال حدثنا يحيى بن سعيد الأنصاري، قال أخبرني محمد بن إبراهيم التيمي، أنه سمع علقمة بن وقاص الليثي، يقول سمعت عمر بن الخطاب ـ رضى الله عنه ـ على المنبر قال سمعت رسول الله صلى الله عليه وسلم يقول:**

> " إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى، فمن كانت هجرته إلى دنيا يصيبها، أو إلى امرأة ينكحها، فهجرته إلى ما هاجر إليه "`,
        narrator: 'Umar bin Al-Khattab',
        grade: 'Sahih',
        status: 'published',
        createdAt: Date.now(),
        updatedAt: Date.now()
    }
];
