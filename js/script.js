// 配置后端 API 基础 URL
const API_BASE_URL = 'http://localhost:5000';  // 开发环境
// 生产环境：const API_BASE_URL = 'https://你的后端域名';

document.getElementById('searchBtn').addEventListener('click', function () {
    const dbType = document.getElementById('dbType').value;
    const searchText = document.getElementById('searchInput').value.trim();

    if (!searchText) {
        alert('请输入搜索关键词');
        return;
    }

    console.log(`开始请求：dbType = ${dbType}, searchText = ${searchText}`);

    // 调用后端 API
    fetch(`${API_BASE_URL}/api/tables/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ db_type: dbType, search_text: searchText })
    })
    .then(response => response.json())
    .then(data => {
        console.log('返回的数据：', data);

        const resultsTable = document.getElementById('resultsBody');
        resultsTable.innerHTML = '';  // 清空现有结果

        if (data.success) {
            if (data.data && data.data.length > 0) {
                // 根据返回的数据格式（MySQL 或 PostgreSQL）来处理
                if (Array.isArray(data.data[0])) {
                    // PostgreSQL 数据格式：列表嵌套列表
                    data.data.forEach(row => {
                        const tr = document.createElement('tr');
                        const tableName = document.createElement('td');
                        const tableComment = document.createElement('td');
                        tableName.textContent = row[1] || '无表名';
                        tableComment.textContent = row[2] || '无描述';
                        tr.appendChild(tableName);
                        tr.appendChild(tableComment);
                        resultsTable.appendChild(tr);
                    });
                } else {
                    // MySQL 数据格式：列表嵌套字典
                    data.data.forEach(row => {
                        const tr = document.createElement('tr');
                        const tableName = document.createElement('td');
                        const tableComment = document.createElement('td');
                        tableName.textContent = row.table_name || '无表名';
                        tableComment.textContent = row.table_comment || '无描述';
                        tr.appendChild(tableName);
                        tr.appendChild(tableComment);
                        resultsTable.appendChild(tr);
                    });
                }
            } else {
                // 如果没有数据，显示无结果信息
                const tr = document.createElement('tr');
                const td = document.createElement('td');
                td.colSpan = 2;
                td.textContent = '没有找到匹配的表';
                tr.appendChild(td);
                resultsTable.appendChild(tr);
            }
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        alert('发生错误，请稍后重试');
        console.error('API 调用错误:', error);
    });
});

// 添加页面加载时的健康检查
window.addEventListener('load', function() {
    fetch(`${API_BASE_URL}/api/health`)
        .then(response => response.json())
        .then(data => {
            console.log('后端服务状态:', data);
        })
        .catch(error => {
            console.error('后端服务连接失败:', error);
            alert('后端服务连接失败，请确保后端服务正在运行');
        });
});