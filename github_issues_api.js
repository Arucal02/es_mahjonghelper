// GitHub Issues API 配置
const GITHUB_CONFIG = {
    owner: 'Arucal02',  // GitHub 用户名
    repo: 'es_mahjonghelper',  // 仓库名
    apiUrl: 'https://api.github.com',
    // GitHub 个人访问令牌，用于提高API请求限制
    // 注意：不要将真实令牌硬编码在代码中，GitHub会检测到并发出警告
    // 没有令牌功能仍然可用，只是请求限制更低（每小时60次）
    token: ''  // 已移除硬编码的令牌
};

// 将留言数据转换为 GitHub Issue 格式
function messageToIssue(message, type, yaku) {
    return {
        title: `[${type}] ${yaku} - ${message.nickname}的留言`,
        body: `# ${type} 类型 - ${yaku}\n\n**昵称:** ${message.nickname}\n**时间:** ${new Date(message.timestamp).toLocaleString('zh-CN')}\n\n## 留言内容\n${message.content}`,
        labels: [`${type}-${yaku}`, 'message']
    };
}

// 将 GitHub Issue 转换为留言数据格式
function issueToMessage(issue) {
    // 从标题中提取类型和yaku
    const titleMatch = issue.title.match(/^\[(.*?)\]\s*(.*?)\s*-/);
    const type = titleMatch ? titleMatch[1] : 'yaku';
    const yaku = titleMatch ? titleMatch[2] : 'unknown';
    
    // 从body中提取昵称
    const nicknameMatch = issue.body.match(/\*\*昵称:\*\*\s*(.*?)\n/);
    const nickname = nicknameMatch ? nicknameMatch[1] : '匿名用户';
    
    // 提取留言内容
    const contentMatch = issue.body.match(/## 留言内容\n([\s\S]*)$/);
    const content = contentMatch ? contentMatch[1].trim() : issue.body;
    
    return {
        id: issue.id,
        content: content,
        timestamp: issue.created_at,
        date: new Date(issue.created_at).toLocaleString('zh-CN'),
        nickname: nickname,
        likes: issue.reactions ? issue.reactions.plus_one || 0 : 0,
        userIdentifier: issue.user.login,
        replies: [] // GitHub Issues的评论会作为回复
    };
}

// 保存留言到 GitHub Issues
async function saveMessageToGitHub(type, yaku, content, nickname) {
    try {
        const message = {
            content: content,
            timestamp: new Date().toISOString(),
            nickname: nickname
        };
        
        const issueData = messageToIssue(message, type, yaku);
        
        const headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        };
        
        // 如果有令牌，添加认证头
        if (GITHUB_CONFIG.token) {
            headers['Authorization'] = `token ${GITHUB_CONFIG.token}`;
        }
        
        const response = await fetch(
            `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues`,
            {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(issueData)
            }
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API 错误: ${response.status}`);
        }
        
        const issue = await response.json();
        return issueToMessage(issue);
    } catch (error) {
        console.error('保存留言到GitHub Issues失败:', error);
        throw error;
    }
}

// 从 GitHub Issues 加载留言
async function loadMessagesFromGitHub(type, yaku) {
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        // 如果有令牌，添加认证头
        if (GITHUB_CONFIG.token) {
            headers['Authorization'] = `token ${GITHUB_CONFIG.token}`;
        }
        
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('labels', `message,${type}-${yaku}`);
        params.append('state', 'open');
        params.append('sort', 'created');
        params.append('direction', 'desc');
        
        const response = await fetch(
            `${GITHUB_CONFIG.apiUrl}/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/issues?${params.toString()}`,
            {
                method: 'GET',
                headers: headers
            }
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API 错误: ${response.status}`);
        }
        
        const issues = await response.json();
        return issues.map(issueToMessage);
    } catch (error) {
        console.error('从GitHub Issues加载留言失败:', error);
        throw error;
    }
}

// 导出函数（如果需要在其他文件中使用）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        saveMessageToGitHub,
        loadMessagesFromGitHub
    };
}