'use server'

import { db } from "@/src";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function insertWilayas() {
    try {
        const response = await db.execute(
            sql`INSERT INTO wilaya (code, name, ar_name) VALUES
        (1, 'Adrar', 'أدرار'),
        (2, 'Chlef', 'الشلف'),
        (3, 'Laghouat', 'الأغواط'),
        (4, 'Oum El Bouaghi', 'أم البواقي'),
        (5, 'Batna', 'باتنة'),
        (6, 'Béjaïa', 'بجاية'),
        (7, 'Biskra', 'بسكرة'),
        (8, 'Bechar', 'بشار'),
        (9, 'Blida', 'البليدة'),
        (10, 'Bouira', 'البويرة'),
        (11, 'Tamanrasset', 'تمنراست'),
        (12, 'Tbessa', 'تبسة'),
        (13, 'Tlemcen', 'تلمسان'),
        (14, 'Tiaret', 'تيارت'),
        (15, 'Tizi Ouzou', 'تيزي وزو'),
        (16, 'Alger', 'الجزائر'),
        (17, 'Djelfa', 'الجلفة'),
        (18, 'Jijel', 'جيجل'),
        (19, 'Setif', 'سطيف'),
        (20, 'Saida', 'سعيدة'),
        (21, 'Skikda', 'سكيكدة'),
        (22, 'Sidi Bel Abbes', 'سيدي بلعباس'),
        (23, 'Annaba', 'عنابة'),
        (24, 'Guelma', 'قالمة'),
        (25, 'Constantine', 'قسنطينة'),
        (26, 'Medea', 'المدية'),
        (27, 'Mostaganem', 'مستغانم'),
        (28, 'M''Sila', 'المسيلة'),
        (29, 'Mascara', 'معسكر'),
        (30, 'Ouargla', 'ورقلة'),
        (31, 'Oran', 'وهران'),
        (32, 'El Bayadh', 'البيض'),
        (33, 'Illizi', 'إليزي'),
        (34, 'Bordj Bou Arreridj', 'برج بوعريريج'),
        (35, 'Boumerdes', 'بومرداس'),
        (36, 'El Tarf', 'الطارف'),
        (37, 'Tindouf', 'تندوف'),
        (38, 'Tissemsilt', 'تيسمسيلت'),
        (39, 'El Oued', 'الوادي'),
        (40, 'Khenchela', 'خنشلة'),
        (41, 'Souk Ahras', 'سوق أهراس'),
        (42, 'Tipaza', 'تيبازة'),
        (43, 'Mila', 'ميلة'),
        (44, 'Ain Defla', 'عين الدفلى'),
        (45, 'Naama', 'النعامة'),
        (46, 'Ain Temouchent', 'عين تموشنت'),
        (47, 'Ghardaia', 'غرداية'),
        (48, 'Relizane', 'غليزان'),
        (49, 'El M''ghair', 'المغير'),
        (50, 'El Menia', 'المنيعة'),
        (51, 'Ouled Djellal', 'أولاد جلال'),
        (52, 'Bordj Baji Mokhtar', 'برج باجي مختار'),
        (53, 'Béni Abbès', 'بني عباس'),
        (54, 'Timimoun', 'تيميمون'),
        (55, 'Touggourt', 'تقرت'),
        (56, 'Djanet', 'جانت'),
        (57, 'In Salah', 'عين صالح'),
        (58, 'In Guezzam', 'عين قزام'),
        (59, 'Aflou', 'آفلو'),
        (60, 'Barika', 'بريكة'),
        (61, 'El Kantara', 'القنطرة'),
        (62, 'Bir El Ater', 'بئر العاتر'),
        (63, 'El Aricha', 'العريشة'),
        (64, 'Ksar Chellala', 'قصر الشلالة'),
        (65, 'Ain Oussera', 'عين وسارة'),
        (66, 'Messad', 'مسعد'),
        (67, 'Ksar El Boukhari', 'قصر البخاري'),
        (68, 'Bou Saada', 'بوسعادة'),
        (69, 'El Abiodh Sidi Cheikh', 'الأبيض سيدي الشيخ');`);


        revalidatePath("/admin/settings")
    } catch (err) {
        console.log(err);
    }

}