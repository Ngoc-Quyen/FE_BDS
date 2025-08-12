import React from 'react';
import { Link } from 'react-router-dom';
import Feature from '../../components/FeatureCard';
import PropertyCard from '../../components/PropertyCard';
import { sampleProperties } from '../../types/property';

const HomePage: React.FC = () => {
    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                    <h1 className="text-4xl font-extrabold leading-tight">あなたの夢の家を見つけよう</h1>
                    <p className="mt-4 text-gray-600">
                        不動産の検索、絞り込み、比較、管理を簡単に。住宅からオフィスまで、すべて揃っています。
                    </p>

                    <div className="mt-6 flex gap-3">
                        <Link
                            to="/list"
                            className="inline-flex items-center px-5 py-3 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
                        >
                            一覧を見る
                        </Link>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                        <Feature title="検索と絞り込み(Search & Filter)" desc="価格、場所、面積で検索" />
                        <Feature title="画像アップロード(Upload Image)" desc="複数画像をアップロード、プレビュー表示" />
                        <Feature title="管理" desc="確認付きで作成・編集・削除 " />
                        <Feature
                            title="ページネーションと並べ替え(Phân trang & sắp xếp)"
                            desc="大規模なリストでもスムーズに表示"
                        />
                    </div>
                </div>

                <div className="w-full h-100 bg-gray-100 rounded-lg flex items-center justify-center">
                    <img src="/ban_do_DN.jpg" alt="地図の絵" className="w-full h-full object-cover rounded-lg" />
                </div>
            </section>

            <section className="mt-12">
                <h2 className="text-2xl font-semibold">注目の物件(Bất động sản nổi bật)</h2>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sampleProperties.map((p) => (
                        <PropertyCard key={p.id} property={p} />
                    ))}
                </div>
            </section>
        </main>
    );
};

export default HomePage;
