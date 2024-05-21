`
/datasets
{status: "success", data: []}
{status: "failed", message: "Failed to fetch datasets"}

/datasets?page[size]=10&page[number]=1
{status: "success", data: [],links: {}, meta: {}}
{status: "failed", message: [{}]}

/dataset/version
{status: "success", data: {}}
{status: "failed", message: "Failed to fetch datasets"}

/fields
{status: "success", data: []}
{status: "failed", message: "Version doesn't exist"} // 404
{status: "failed", message: {}} // 422

/query
{status: "success", data: []}
{status: "failed", message: "Failed to query data"}

/auth/apikeys
{status: "success", data: []}
{status: "failed", message: "Failed to fetch API keys"}

`;
