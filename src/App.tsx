import React, { useState, useEffect } from 'react';
import './App.css';
import groupsData from './groups.json';

interface GetGroupsResponse {
    result: 1 | 0;
    data?: Group[];
}

interface Group {
    id: number;
    name: string;
    closed: boolean;
    avatar_color?: string;
    members_count: number;
    friends?: User[];
}

interface User {
    first_name: string;
    last_name: string;
}

const App: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [privacyFilter, setPrivacyFilter] = useState<'all' | 'open' | 'closed'>('all');
    const [colorFilter, setColorFilter] = useState<string | null>(null);
    const [friendsFilter, setFriendsFilter] = useState(false);

    useEffect(() => {
        fetchGroups();
    }, []);

    const fetchGroups = async () => {
        try {
            // Имитация задержки запроса на 1 секунду
            await new Promise(resolve => setTimeout(resolve, 1000));

            const response: GetGroupsResponse = {
                result: 1,
                data: groupsData,
            };

            if (response.result === 1 && response.data) {
                setGroups(response.data);
            } else {
                setError(true);
            }
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const filteredGroups = groups.filter(group => {
        const privacyMatch =
            privacyFilter === 'all' ||
            (privacyFilter === 'open' && !group.closed) ||
            (privacyFilter === 'closed' && group.closed);

        const colorMatch = !colorFilter || group.avatar_color === colorFilter;

        const friendsMatch = !friendsFilter || (group.friends && group.friends.length > 0);

        return privacyMatch && colorMatch && friendsMatch;
    });

    const availableColors = Array.from(new Set(groups.map(group => group.avatar_color))).filter(Boolean);

    return (
        <div className="app">
            <h1>Список групп</h1>

            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p>Ошибка при загрузке данных.</p>
            ) : (
                <>
                    <div className="filters">
                        <div>
                            <label>Тип приватности:</label>
                            <select value={privacyFilter} onChange={e => setPrivacyFilter(e.target.value as 'all' | 'open' | 'closed')}>
                                <option value="all">Все</option>
                                <option value="open">Открытые</option>
                                <option value="closed">Закрытые</option>
                            </select>
                        </div>
                        <div>
                            <label>Цвет аватарки:</label>
                            <select value={colorFilter || ''} onChange={e => setColorFilter(e.target.value || null)}>
                                <option value="">Любой</option>
                                {availableColors.map(color => (
                                    <option key={color} value={color}>
                                        {color}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={friendsFilter}
                                    onChange={e => setFriendsFilter(e.target.checked)}
                                />
                                Есть друзья в группе
                            </label>
                        </div>
                    </div>

                    <div className="group-list">
                        {filteredGroups.map(group => (
                            <div key={group.id} className="group-item">
                                <div className="group-info">
                                    {group.avatar_color && (
                                        <div
                                            className="group-avatar"
                                            style={{
                                                backgroundColor: group.avatar_color,
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '50%',
                                            }}
                                        />
                                    )}
                                    <h3>{group.name}</h3>
                                    <p>Тип: {group.closed ? 'Закрытая' : 'Открытая'}</p>
                                    <p>Подписчиков: {group.members_count}</p>
                                    {group.friends && group.friends.length > 0 && (
                                        <div className="friends-toggle">
                                            <p>Друзей: {group.friends.length}</p>
                                            <ul>
                                                {group.friends.map((friend, index) => (
                                                    <li key={index}>
                                                        {friend.first_name} {friend.last_name}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default App;